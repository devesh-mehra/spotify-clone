import { useMemo, useState } from "react";
import TrackRow from "../components/TrackRow";

export default function Search({ albums, loading, error }) {
  const [query, setQuery] = useState("");

  const allTracks = useMemo(
    () =>
      albums.flatMap((album) =>
        album.tracks.map((track) => ({ ...track, cover: album.cover, albumTitle: album.title }))
      ),
    [albums]
  );

  const results = useMemo(() => {
    if (!query.trim()) return allTracks;
    const q = query.toLowerCase();
    return allTracks.filter(
      (t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q) || t.albumTitle.toLowerCase().includes(q)
    );
  }, [query, allTracks]);

  if (loading) return <div className="state-message">Loading…</div>;
  if (error) return <div className="state-message error">{error}</div>;

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
      <div className="track-list">
        {results.map((track, index) => (
          <TrackRow key={track.id} track={track} index={index} queue={results} album={track.albumTitle} />
        ))}
        {results.length === 0 && <div className="state-message">No results for "{query}"</div>}
      </div>
    </div>
  );
}
