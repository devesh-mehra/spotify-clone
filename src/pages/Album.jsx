import { useParams } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext";
import TrackRow from "../components/TrackRow";
import { PlayIcon, PauseIcon } from "../components/icons";

export default function Album({ albums, loading, error }) {
  const { albumId } = useParams();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  if (loading) return <div className="state-message">Loading album…</div>;
  if (error) return <div className="state-message error">{error}</div>;

  const album = albums.find((a) => a.id === albumId);
  if (!album) return <div className="state-message">Album not found.</div>;

  const queue = album.tracks.map((t) => ({ ...t, cover: album.cover }));
  const albumIsPlaying = currentTrack && queue.some((t) => t.id === currentTrack.id) && isPlaying;

  const handleHeaderPlay = () => {
    if (currentTrack && queue.some((t) => t.id === currentTrack.id)) {
      togglePlay();
    } else {
      playTrack(queue[0], queue);
    }
  };

  return (
    <div className="album-page">
      <div className="album-header">
        <img src={album.cover} alt={album.title} className="album-header-cover" />
        <div>
          <div className="album-header-kicker">Album</div>
          <h1 className="album-header-title">{album.title}</h1>
          <p className="album-header-desc">{album.description}</p>
          <div className="album-header-meta">
            {album.artist} · {album.tracks.length} songs
          </div>
        </div>
      </div>

      <button className="play-btn large" onClick={handleHeaderPlay}>
        {albumIsPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <div className="track-list">
        {queue.map((track, index) => (
          <TrackRow key={track.id} track={track} index={index} queue={queue} />
        ))}
      </div>
    </div>
  );
}
