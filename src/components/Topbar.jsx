import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="topbar-nav">
        <button className="round-btn" onClick={() => navigate(-1)} aria-label="Go back">
          ‹
        </button>
        <button className="round-btn" onClick={() => navigate(1)} aria-label="Go forward">
          ›
        </button>
      </div>
    </header>
  );
}
