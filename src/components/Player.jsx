import { useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import { formatTime } from "../utils/format";
import { PlayIcon, PauseIcon, PrevIcon, NextIcon, VolumeIcon, ShuffleIcon, RepeatIcon } from "./icons";
import NowPlaying from "./NowPlaying";
import MarqueeText from "./MarqueeText";

export default function Player() {
  const [showNowPlaying, setShowNowPlaying] = useState(false);
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackError,
    shuffle,
    repeatMode,
    autoplay,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleShuffle,
    cycleRepeatMode,
    toggleAutoplay,
  } = usePlayer();

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <footer className="player-bar">
      <div className="player-now-playing">
        {currentTrack ? (
          <>
            <img
              src={currentTrack.thumbnail}
              alt=""
              className="player-cover"
              onClick={() => setShowNowPlaying(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setShowNowPlaying(true);
              }}
            />
            <div className="player-track-info">
              <div className="player-track-title">
                <MarqueeText text={currentTrack.title} />
              </div>
              <div className="player-track-artist">{currentTrack.artist}</div>
              {playbackError && <div className="player-track-unavailable">Can't play this video — skipping…</div>}
            </div>
          </>
        ) : (
          <div className="player-placeholder">Select a track to start listening</div>
        )}
      </div>

      <div className="player-controls">
        <div className="player-buttons">
          <button className={`icon-btn ${shuffle ? "active" : ""}`} onClick={toggleShuffle} aria-label="Shuffle">
            <ShuffleIcon />
          </button>
          <button className="icon-btn" onClick={prev} disabled={!currentTrack} aria-label="Previous track">
            <PrevIcon />
          </button>
          <button className="play-btn" onClick={togglePlay} disabled={!currentTrack || playbackError} aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="icon-btn" onClick={next} disabled={!currentTrack} aria-label="Next track">
            <NextIcon />
          </button>
          <button
            className={`icon-btn ${repeatMode !== "off" ? "active" : ""}`}
            onClick={cycleRepeatMode}
            aria-label={`Repeat: ${repeatMode}`}
          >
            <RepeatIcon />
            {repeatMode === "one" && <span className="repeat-one-badge">1</span>}
          </button>
        </div>
        <div className="player-progress">
          <span className="time-label">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="seek-bar"
            style={{ "--progress": `${progressPct}%` }}
            disabled={!currentTrack || playbackError}
          />
          <span className="time-label">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-volume">
        <button
          className={`text-toggle-btn ${autoplay ? "active" : ""}`}
          onClick={toggleAutoplay}
          aria-label="Toggle autoplay of similar songs when the queue ends"
          title="Autoplay similar songs when the queue ends"
        >
          Autoplay
        </button>
        <VolumeIcon level={volume} />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="volume-bar"
          style={{ "--progress": `${volume * 100}%` }}
        />
      </div>

      {showNowPlaying && <NowPlaying onClose={() => setShowNowPlaying(false)} />}
    </footer>
  );
}
