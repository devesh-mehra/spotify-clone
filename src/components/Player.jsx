import { usePlayer } from "../context/PlayerContext";
import { formatTime } from "../utils/format";
import { PlayIcon, PauseIcon, PrevIcon, NextIcon, VolumeIcon } from "./icons";

export default function Player() {
  const { currentTrack, isPlaying, currentTime, duration, volume, togglePlay, next, prev, seek, setVolume } = usePlayer();

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <footer className="player-bar">
      <div className="player-now-playing">
        {currentTrack ? (
          <>
            <img src={currentTrack.cover || currentTrack.albumCover} alt="" className="player-cover" />
            <div>
              <div className="player-track-title">{currentTrack.title}</div>
              <div className="player-track-artist">{currentTrack.artist}</div>
            </div>
          </>
        ) : (
          <div className="player-placeholder">Select a track to start listening</div>
        )}
      </div>

      <div className="player-controls">
        <div className="player-buttons">
          <button className="icon-btn" onClick={prev} disabled={!currentTrack} aria-label="Previous track">
            <PrevIcon />
          </button>
          <button className="play-btn" onClick={togglePlay} disabled={!currentTrack} aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="icon-btn" onClick={next} disabled={!currentTrack} aria-label="Next track">
            <NextIcon />
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
            disabled={!currentTrack}
          />
          <span className="time-label">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-volume">
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
    </footer>
  );
}
