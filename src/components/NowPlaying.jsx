import { useEffect } from "react";
import { usePlayer } from "../context/PlayerContext";
import { formatTime } from "../utils/format";
import { PlayIcon, PauseIcon, PrevIcon, NextIcon, ShuffleIcon, RepeatIcon, CloseIcon } from "./icons";

export default function NowPlaying({ onClose }) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    playbackError,
    shuffle,
    repeatMode,
    togglePlay,
    next,
    prev,
    seek,
    toggleShuffle,
    cycleRepeatMode,
  } = usePlayer();

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!currentTrack) return null;

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="now-playing-overlay" onClick={onClose}>
      <div className="now-playing-panel" onClick={(e) => e.stopPropagation()}>
        <button className="now-playing-close" onClick={onClose} aria-label="Close now playing">
          <CloseIcon />
        </button>

        <img src={currentTrack.thumbnail} alt="" className="now-playing-art" />
        <div className="now-playing-title">{currentTrack.title}</div>
        <div className="now-playing-artist">{currentTrack.artist}</div>
        {playbackError && <div className="player-track-unavailable">Can't play this video — skipping…</div>}

        <div className="now-playing-progress">
          <span className="time-label">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="seek-bar"
            style={{ "--progress": `${progressPct}%` }}
            disabled={playbackError}
          />
          <span className="time-label">{formatTime(duration)}</span>
        </div>

        <div className="now-playing-buttons">
          <button className={`icon-btn ${shuffle ? "active" : ""}`} onClick={toggleShuffle} aria-label="Shuffle">
            <ShuffleIcon width={20} height={20} />
          </button>
          <button className="icon-btn" onClick={prev} aria-label="Previous track">
            <PrevIcon width={22} height={22} />
          </button>
          <button
            className="play-btn xlarge"
            onClick={togglePlay}
            disabled={playbackError}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon width={28} height={28} /> : <PlayIcon width={28} height={28} />}
          </button>
          <button className="icon-btn" onClick={next} aria-label="Next track">
            <NextIcon width={22} height={22} />
          </button>
          <button
            className={`icon-btn ${repeatMode !== "off" ? "active" : ""}`}
            onClick={cycleRepeatMode}
            aria-label={`Repeat: ${repeatMode}`}
          >
            <RepeatIcon width={20} height={20} />
            {repeatMode === "one" && <span className="repeat-one-badge">1</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
