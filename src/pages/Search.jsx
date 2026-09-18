import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TrackRow from "../components/TrackRow";
import { searchTracks, hasApiKey } from "../api/youtubeApi";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const trimmed = query.trim();
    setSearchParams(trimmed ? { q: trimmed } : {}, { replace: true });

    if (!trimmed) {
      setResults([]);
      setStatus("idle");
      return;
    }

    if (!hasApiKey()) {
      setStatus("error");
      setErrorMessage("Missing YouTube Data API key. Add VITE_YOUTUBE_API_KEY to your .env file (see README) to enable search.");
      return;
    }

    setStatus("loading");
    const timeout = setTimeout(() => {
      searchTracks(trimmed)
        .then((tracks) => {
          setResults(tracks);
          setStatus("success");
        })
        .catch((err) => {
          setStatus("error");
          setErrorMessage(err.message || "Search failed.");
        });
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="search-page">
      <input
        type="text"
        className="search-input"
        placeholder="What do you want to listen to?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      {status === "error" && <div className="state-message error">{errorMessage}</div>}
      {status === "success" && results.length === 0 && <div className="state-message">No results for "{query}"</div>}
      {status === "success" && results.length > 0 && (
        <div className="track-list">
          {results.map((track, index) => (
            // No shared queue here on purpose: clicking a song starts a radio-style
            // queue of just that track, and autoplay immediately fills in similar
            // songs next (like Spotify/YT Music radio), instead of stepping through
            // every other raw search result first.
            <TrackRow key={track.id} track={track} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
