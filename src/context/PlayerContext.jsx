import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const currentTrack = queueIndex >= 0 ? queue[queueIndex] : null;

  useEffect(() => {
    const audio = audioRef.current;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => next();
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, queueIndex]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!currentTrack) return;
    const audio = audioRef.current;
    audio.src = currentTrack.src;
    setCurrentTime(0);
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  const playTrack = useCallback((track, trackQueue) => {
    const list = trackQueue || [track];
    const index = list.findIndex((t) => t.id === track.id);
    setQueue(list);
    setQueueIndex(index === -1 ? 0 : index);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!currentTrack) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [currentTrack, isPlaying]);

  const next = useCallback(() => {
    setQueueIndex((prev) => {
      if (prev === -1 || queue.length === 0) return prev;
      const nextIndex = (prev + 1) % queue.length;
      setIsPlaying(true);
      return nextIndex;
    });
  }, [queue]);

  const prev = useCallback(() => {
    setQueueIndex((prevIndex) => {
      if (prevIndex === -1 || queue.length === 0) return prevIndex;
      const target = (prevIndex - 1 + queue.length) % queue.length;
      setIsPlaying(true);
      return target;
    });
  }, [queue]);

  const seek = useCallback((time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const value = useMemo(
    () => ({
      currentTrack,
      queue,
      isPlaying,
      currentTime,
      duration,
      volume,
      playTrack,
      togglePlay,
      next,
      prev,
      seek,
      setVolume,
    }),
    [currentTrack, queue, isPlaying, currentTime, duration, volume, playTrack, togglePlay, next, prev, seek]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within a PlayerProvider");
  return ctx;
}
