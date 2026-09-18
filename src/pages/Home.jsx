import { useNavigate } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext";

const GENRE_SHORTCUTS = ["Pop", "Hip-Hop", "Lo-fi Beats", "Rock", "Bollywood", "K-Pop", "Jazz", "EDM"];

export default function Home() {
  const navigate = useNavigate();
  const { playlists } = usePlayer();
  const greeting = getGreeting();

  return (
    <div className="home-page">
      <h1 className="page-heading">{greeting}</h1>

      <section>
        <h2 className="section-heading">Browse</h2>
        <div className="genre-grid">
          {GENRE_SHORTCUTS.map((genre) => (
            <button key={genre} className="genre-chip" onClick={() => navigate(`/search?q=${encodeURIComponent(genre)}`)}>
              {genre}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-heading">Your Playlists</h2>
        <div className="playlist-card-grid">
          {playlists.map((p) => (
            <button key={p.id} className="playlist-card" onClick={() => navigate(`/playlist/${p.id}`)}>
              <div className="playlist-card-name">{p.name}</div>
              <div className="playlist-card-count">{p.tracks.length} songs</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
