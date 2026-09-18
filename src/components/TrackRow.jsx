import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import { formatTime } from "../utils/format";
import { PlayIcon, PauseIcon, PlusIcon, RemoveIcon } from "./icons";

export default function TrackRow({ track, index, queue, playlistId }) {
  const {
    currentTrack,
    isPlaying,
    playbackError,
    playTrack,
    togglePlay,
    playlists,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    createPlaylist,
  } = usePlayer();
  const isCurrent = currentTrack?.id === track.id;
  const hasError = isCurrent && playbackError;
  const inAnyPlaylist = playlists.some((p) => p.tracks.some((t) => t.id === track.id));

  const [menuOpen, setMenuOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  const handleClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, queue);
    }
  };

  const handleCreateAndAdd = (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    const id = createPlaylist(name);
    addTrackToPlaylist(id, track);
    setNewName("");
  };

  return (
    <div className={`track-row ${isCurrent ? "active" : ""} ${hasError ? "unavailable" : ""}`} onClick={handleClick}>
      <div className="track-row-index">
        {hasError ? "!" : isCurrent && isPlaying ? <PauseIcon /> : isCurrent ? <PlayIcon /> : index + 1}
      </div>
      <img src={track.thumbnail} alt="" className="track-row-thumb" loading="lazy" />
      <div className="track-row-info">
        <div className="track-row-title">{track.title}</div>
        <div className="track-row-artist">{track.artist}</div>
      </div>

      {playlistId ? (
        <button
          className="icon-btn playlist-toggle active"
          onClick={(e) => {
            e.stopPropagation();
            removeTrackFromPlaylist(playlistId, track.id);
          }}
          aria-label="Remove from this playlist"
        >
          <RemoveIcon />
        </button>
      ) : (
        <div className="playlist-menu-anchor" ref={menuRef}>
          <button
            className={`icon-btn playlist-toggle ${inAnyPlaylist ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            aria-label="Add to playlist"
          >
            <PlusIcon />
          </button>
          {menuOpen && (
            <div className="playlist-menu" onClick={(e) => e.stopPropagation()}>
              <div className="playlist-menu-heading">Add to playlist</div>
              {playlists.map((p) => {
                const inThis = p.tracks.some((t) => t.id === track.id);
                return (
                  <button
                    key={p.id}
                    className="playlist-menu-item"
                    onClick={() => (inThis ? removeTrackFromPlaylist(p.id, track.id) : addTrackToPlaylist(p.id, track))}
                  >
                    <span className={`playlist-menu-check ${inThis ? "checked" : ""}`} />
                    {p.name}
                  </button>
                );
              })}
              <form className="playlist-menu-new" onSubmit={handleCreateAndAdd}>
                <input
                  type="text"
                  placeholder="New playlist name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button type="submit" aria-label="Create playlist">
                  <PlusIcon />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      <div className="track-row-duration">{hasError ? "Unavailable" : formatTime(track.durationSec ?? 0)}</div>
    </div>
  );
}
