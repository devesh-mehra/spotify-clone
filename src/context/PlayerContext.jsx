import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { loadYouTubeIframeAPI } from "../utils/youtubePlayerLoader";
import { hasApiKey, searchTracks, cleanArtistName, normalizeTitle } from "../api/youtubeApi";

const PLAYLISTS_STORAGE_KEY = "spotify-update:playlists";
const LEGACY_PLAYLIST_STORAGE_KEY = "spotify-update:playlist";
const PlayerContext = createContext(null);

function createPlaylistObject(name, tracks = []) {
  return {
    id: `pl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    tracks,
  };
}

function loadStoredPlaylists() {
  try {
    const raw = localStorage.getItem(PLAYLISTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fall through to legacy migration / default below
  }

  // Migrate from the old single-playlist format so earlier saved tracks aren't lost.
  try {
    const legacyRaw = localStorage.getItem(LEGACY_PLAYLIST_STORAGE_KEY);
    const legacyTracks = legacyRaw ? JSON.parse(legacyRaw) : [];
    if (Array.isArray(legacyTracks) && legacyTracks.length > 0) {
      return [createPlaylistObject("My Playlist", legacyTracks)];
    }
  } catch {
    // ignore and fall through to default
  }

  return [createPlaylistObject("My Playlist")];
}

export function PlayerProvider({ children }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const queueRef = useRef([]);
  const queueIndexRef = useRef(-1);
  const currentTrackRef = useRef(null);
  const pendingTrackRef = useRef(null);
  const shuffleRef = useRef(false);
  const repeatModeRef = useRef("off");
  const autoplayRef = useRef(true);
  const shuffleHistoryRef = useRef([]);
  const [isReady, setIsReady] = useState(false);

  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [errorTrackId, setErrorTrackId] = useState(null);
  const [playlists, setPlaylists] = useState(loadStoredPlaylists);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off"); // "off" | "all" | "one"
  const [autoplay, setAutoplay] = useState(true);

  const currentTrack = queueIndex >= 0 ? queue[queueIndex] : null;
  const playbackError = Boolean(currentTrack) && errorTrackId === currentTrack.id;

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    queueIndexRef.current = queueIndex;
  }, [queueIndex]);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  useEffect(() => {
    shuffleRef.current = shuffle;
  }, [shuffle]);

  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  useEffect(() => {
    autoplayRef.current = autoplay;
  }, [autoplay]);

  useEffect(() => {
    try {
      localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists));
    } catch {
      // ignore storage errors (private mode, quota, etc.)
    }
  }, [playlists]);

  // Continue the queue with more songs by the same artist once it runs out, like YT Music's autoplay/radio.
  const extendQueueWithRecommendations = useCallback(async () => {
    const track = currentTrackRef.current;
    if (!track || !hasApiKey()) return false;
    try {
      const artist = cleanArtistName(track.artist);
      const results = await searchTracks(`${artist} songs`, { maxResults: 10 });
      const existingIds = new Set(queueRef.current.map((t) => t.id));
      const existingTitles = new Set(queueRef.current.map((t) => normalizeTitle(t.title)));
      const fresh = results.filter((t) => !existingIds.has(t.id) && !existingTitles.has(normalizeTitle(t.title)));
      if (fresh.length === 0) return false;
      setQueue((prev) => [...prev, ...fresh]);
      return true;
    } catch {
      return false;
    }
  }, []);

  const goNext = useCallback(async () => {
    const list = queueRef.current;
    const index = queueIndexRef.current;
    if (list.length === 0) return;

    if (shuffleRef.current) {
      if (list.length === 1) return;
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * list.length);
      } while (randomIndex === index);
      shuffleHistoryRef.current.push(index);
      setQueueIndex(randomIndex);
      return;
    }

    const isLast = index === list.length - 1;
    if (!isLast) {
      setQueueIndex(index + 1);
      return;
    }

    if (repeatModeRef.current === "all") {
      setQueueIndex(0);
      return;
    }

    if (autoplayRef.current) {
      const added = await extendQueueWithRecommendations();
      if (added) {
        setQueueIndex(index + 1);
        return;
      }
    }

    const player = playerRef.current;
    if (player && typeof player.pauseVideo === "function") player.pauseVideo();
    setIsPlaying(false);
  }, [extendQueueWithRecommendations]);

  const goPrev = useCallback(() => {
    if (shuffleRef.current && shuffleHistoryRef.current.length > 0) {
      const prevIndex = shuffleHistoryRef.current.pop();
      setQueueIndex(prevIndex);
      return;
    }
    setQueueIndex((prev) => {
      const list = queueRef.current;
      if (prev === -1 || list.length === 0) return prev;
      return (prev - 1 + list.length) % list.length;
    });
  }, []);

  const toggleShuffle = useCallback(() => setShuffle((s) => !s), []);
  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((mode) => (mode === "off" ? "all" : mode === "all" ? "one" : "off"));
  }, []);
  const toggleAutoplay = useCallback(() => setAutoplay((a) => !a), []);

  // Create the hidden YouTube player once.
  useEffect(() => {
    let cancelled = false;
    loadYouTubeIframeAPI().then((YT) => {
      if (cancelled || playerRef.current) return;
      playerRef.current = new YT.Player(containerRef.current, {
        height: "0",
        width: "0",
        host: "https://www.youtube-nocookie.com",
        playerVars: { autoplay: 0, controls: 0, disablekb: 1, playsinline: 1 },
        events: {
          onReady: () => {
            playerRef.current.setVolume(volume * 100);
            setIsReady(true);
            if (pendingTrackRef.current) {
              const { videoId, autoplay } = pendingTrackRef.current;
              pendingTrackRef.current = null;
              if (autoplay) playerRef.current.loadVideoById(videoId);
              else playerRef.current.cueVideoById(videoId);
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
            if (event.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
            if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              if (repeatModeRef.current === "one") {
                playerRef.current.seekTo(0, true);
                playerRef.current.playVideo();
              } else {
                goNext();
              }
            }
          },
          onError: () => {
            setErrorTrackId(currentTrackRef.current?.id ?? null);
            setIsPlaying(false);
          },
        },
      });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadVideo = useCallback(
    (videoId, autoplay) => {
      const player = playerRef.current;
      if (!isReady || !player || typeof player.loadVideoById !== "function") {
        pendingTrackRef.current = { videoId, autoplay };
        return;
      }
      if (autoplay) player.loadVideoById(videoId);
      else player.cueVideoById(videoId);
    },
    [isReady]
  );

  // Whenever the current track changes, load it into the player.
  useEffect(() => {
    if (!currentTrack) return;
    setCurrentTime(0);
    setDuration(0);
    setErrorTrackId(null);
    loadVideo(currentTrack.id, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id]);

  // Skip a track automatically if it can't be played (embedding disabled, region-locked, etc.).
  useEffect(() => {
    if (!playbackError) return;
    const timeout = setTimeout(() => {
      setErrorTrackId(null);
      goNext();
    }, 1600);
    return () => clearTimeout(timeout);
  }, [playbackError, goNext]);

  // Poll playback position while playing (the IFrame API has no timeupdate event).
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const player = playerRef.current;
      if (!player || typeof player.getCurrentTime !== "function") return;
      setCurrentTime(player.getCurrentTime());
      setDuration(player.getDuration());
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const player = playerRef.current;
    if (player && typeof player.setVolume === "function") {
      player.setVolume(volume * 100);
    }
  }, [volume]);

  const playTrack = useCallback((track, trackQueue) => {
    const list = trackQueue || [track];
    const index = list.findIndex((t) => t.id === track.id);
    shuffleHistoryRef.current = [];
    setQueue(list);
    setQueueIndex(index === -1 ? 0 : index);
  }, []);

  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!currentTrack || !player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, [currentTrack, isPlaying]);

  const seek = useCallback((time) => {
    const player = playerRef.current;
    if (!player) return;
    player.seekTo(time, true);
    setCurrentTime(time);
  }, []);

  const createPlaylist = useCallback((name) => {
    const playlist = createPlaylistObject(name.trim() || "New Playlist");
    setPlaylists((prev) => [...prev, playlist]);
    return playlist.id;
  }, []);

  const renamePlaylist = useCallback((playlistId, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPlaylists((prev) => prev.map((p) => (p.id === playlistId ? { ...p, name: trimmed } : p)));
  }, []);

  const deletePlaylist = useCallback((playlistId) => {
    setPlaylists((prev) => (prev.length <= 1 ? prev : prev.filter((p) => p.id !== playlistId)));
  }, []);

  const addTrackToPlaylist = useCallback((playlistId, track) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId ? { ...p, tracks: p.tracks.some((t) => t.id === track.id) ? p.tracks : [...p.tracks, track] } : p
      )
    );
  }, []);

  const removeTrackFromPlaylist = useCallback((playlistId, trackId) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) } : p))
    );
  }, []);

  const value = useMemo(
    () => ({
      currentTrack,
      queue,
      isPlaying,
      currentTime,
      duration,
      volume,
      playbackError,
      playlists,
      shuffle,
      repeatMode,
      autoplay,
      playTrack,
      togglePlay,
      next: goNext,
      prev: goPrev,
      seek,
      setVolume,
      createPlaylist,
      renamePlaylist,
      deletePlaylist,
      addTrackToPlaylist,
      removeTrackFromPlaylist,
      toggleShuffle,
      cycleRepeatMode,
      toggleAutoplay,
    }),
    [
      currentTrack,
      queue,
      isPlaying,
      currentTime,
      duration,
      volume,
      playbackError,
      playlists,
      shuffle,
      repeatMode,
      autoplay,
      playTrack,
      togglePlay,
      goNext,
      goPrev,
      seek,
      createPlaylist,
      renamePlaylist,
      deletePlaylist,
      addTrackToPlaylist,
      removeTrackFromPlaylist,
      toggleShuffle,
      cycleRepeatMode,
      toggleAutoplay,
    ]
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <div ref={containerRef} style={{ position: "fixed", bottom: 0, right: 0, width: 1, height: 1, opacity: 0, pointerEvents: "none" }} />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within a PlayerProvider");
  return ctx;
}
