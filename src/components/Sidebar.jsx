import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext";
import { HomeIcon, SearchIcon, LibraryIcon, PlusIcon } from "./icons";

export default function Sidebar() {
  const navigate = useNavigate();
  const { playlists, createPlaylist } = usePlayer();
  const [showNewForm, setShowNewForm] = useState(false);
  const [name, setName] = useState("");

  const handleCreate = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = createPlaylist(trimmed);
    setName("");
    setShowNewForm(false);
    navigate(`/playlist/${id}`);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-dot" />
        Spotify Update
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <HomeIcon /> Home
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <SearchIcon /> Search
        </NavLink>
      </nav>

      <div className="sidebar-library">
        <div className="sidebar-library-header">
          <LibraryIcon /> Your Playlists
          <button className="sidebar-add-btn" onClick={() => setShowNewForm((v) => !v)} aria-label="Create playlist">
            <PlusIcon />
          </button>
        </div>

        {showNewForm && (
          <form className="sidebar-new-playlist-form" onSubmit={handleCreate}>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Playlist name"
              onBlur={() => {
                if (!name.trim()) setShowNewForm(false);
              }}
            />
          </form>
        )}

        <ul className="sidebar-playlist-list">
          {playlists.map((p) => (
            <li key={p.id}>
              <NavLink to={`/playlist/${p.id}`} className={({ isActive }) => `sidebar-playlist-link ${isActive ? "active" : ""}`}>
                <span className="sidebar-playlist-name">{p.name}</span>
                <span className="sidebar-playlist-count">{p.tracks.length}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
