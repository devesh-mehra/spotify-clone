import { useNavigate } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext";
import { PlayIcon, PauseIcon } from "./icons";

export default function AlbumCard({ album }) {
  const navigate = useNavigate();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  const queue = album.tracks.map((t) => ({ ...t, cover: album.cover }));
  const isThisAlbumPlaying = currentTrack && queue.some((t) => t.id === currentTrack.id) && isPlaying;

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (currentTrack && queue.some((t) => t.id === currentTrack.id)) {
      togglePlay();
    } else {
      playTrack(queue[0], queue);
    }
  };

  return (
    <div className="album-card" onClick={() => navigate(`/album/${album.id}`)}>
      <div className="album-card-art">
        <img src={album.cover} alt={album.title} loading="lazy" />
        <button className="album-play-btn" onClick={handlePlayClick} aria-label="Play album">
          {isThisAlbumPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
      <div className="album-card-title">{album.title}</div>
      <div className="album-card-desc">{album.description}</div>
    </div>
  );
}
