import { usePlayer } from "../context/PlayerContext";
import { formatTime } from "../utils/format";
import { PlayIcon, PauseIcon } from "./icons";

export default function TrackRow({ track, index, queue, album }) {
  const { currentTrack, isPlaying, playTrack, togglePlay, duration } = usePlayer();
  const isCurrent = currentTrack?.id === track.id;

  const handleClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, queue);
    }
  };

  const unavailable = !track.src;

  return (
    <div className={`track-row ${isCurrent ? "active" : ""} ${unavailable ? "unavailable" : ""}`} onClick={handleClick}>
      <div className="track-row-index">
        {isCurrent && isPlaying ? <PauseIcon /> : isCurrent ? <PlayIcon /> : index + 1}
      </div>
      <div className="track-row-info">
        <div className="track-row-title">{track.title}</div>
        <div className="track-row-artist">{track.artist}</div>
      </div>
      {album && <div className="track-row-album">{album}</div>}
      <div className="track-row-duration">
        {unavailable ? "No preview" : isCurrent ? formatTime(duration) : "--:--"}
      </div>
    </div>
  );
}
