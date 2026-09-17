import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Player from "./components/Player";
import Home from "./pages/Home";
import Album from "./pages/Album";
import Search from "./pages/Search";
import { fetchLibrary } from "./api/musicApi";
import { PlayerProvider } from "./context/PlayerContext";
import "./App.css";

export default function App() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchLibrary()
      .then((data) => {
        if (!cancelled) setAlbums(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PlayerProvider>
      <div className="app-shell">
        <Sidebar albums={albums} />
        <div className="main-panel">
          <Topbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home albums={albums} loading={loading} error={error} />} />
              <Route path="/album/:albumId" element={<Album albums={albums} loading={loading} error={error} />} />
              <Route path="/search" element={<Search albums={albums} loading={loading} error={error} />} />
            </Routes>
          </main>
        </div>
        <Player />
      </div>
    </PlayerProvider>
  );
}
