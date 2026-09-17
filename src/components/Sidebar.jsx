import { NavLink } from "react-router-dom";
import { HomeIcon, SearchIcon, LibraryIcon } from "./icons";

export default function Sidebar({ albums }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-dot" />
        Grooveify
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
          <LibraryIcon /> Your Library
        </div>
        <ul className="sidebar-album-list">
          {albums.map((album) => (
            <li key={album.id}>
              <NavLink to={`/album/${album.id}`} className={({ isActive }) => `sidebar-album-link ${isActive ? "active" : ""}`}>
                <img src={album.cover} alt="" />
                <div>
                  <div className="sidebar-album-title">{album.title}</div>
                  <div className="sidebar-album-sub">Album · {album.artist}</div>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
