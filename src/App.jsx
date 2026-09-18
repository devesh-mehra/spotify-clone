import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Player from "./components/Player";
import Home from "./pages/Home";
import Playlist from "./pages/Playlist";
import Search from "./pages/Search";
import { PlayerProvider } from "./context/PlayerContext";
import "./App.css";

export default function App() {
  return (
    <PlayerProvider>
      <div className="app-shell">
        <Sidebar />
        <div className="main-panel">
          <Topbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/playlist/:playlistId" element={<Playlist />} />
            </Routes>
          </main>
        </div>
        <Player />
      </div>
    </PlayerProvider>
  );
}
