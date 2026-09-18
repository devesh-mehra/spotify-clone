import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext";
import TrackRow from "../components/TrackRow";
import { PlayIcon, PauseIcon } from "../components/icons";

export default function Playlist() {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { playlists, currentTrack, isPlaying, playTrack, togglePlay, renamePlaylist, deletePlaylist } = usePlayer();
  const playlist = playlists.find((p) => p.id === playlistId);

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(playlist?.name || "");

  if (!playlist) {
    return (
      <div className="state-message">
        Playlist not found.{" "}
        <button className="link-btn" onClick={() => navigate("/")}>
          Go home
        </button>
      </div>
    );
  }

  const tracks = playlist.tracks;
  const playlistIsPlaying = Boolean(currentTrack) && tracks.some((t) => t.id === currentTrack.id) && isPlaying;

  const handlePlay = () => {
    if (tracks.length === 0) return;
    if (currentTrack && tracks.some((t) => t.id === currentTrack.id)) {
      togglePlay();
    } else {
      playTrack(tracks[0], tracks);
    }
  };

  const startEditing = () => {
    setNameDraft(playlist.name);
    setEditingName(true);
  };

  const commitRename = () => {
    renamePlaylist(playlist.id, nameDraft);
    setEditingName(false);
  };

  const handleDelete = () => {
    if (playlists.length <= 1) return;
    if (!window.confirm(`Delete "${playlist.name}"? This can't be undone.`)) return;
    deletePlaylist(playlist.id);
    navigate("/");
  };

  return (
    <div className="album-page">
      <div className="album-header">
        <div>
          <div className="album-header-kicker">Playlist</div>
          {editingName ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                commitRename();
              }}
            >
              <input
                autoFocus
                className="playlist-rename-input"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onBlur={commitRename}
              />
            </form>
          ) : (
            <h1 className="album-header-title playlist-title-editable" onClick={startEditing} title="Click to rename">
              {playlist.name}
            </h1>
          )}
          <div className="album-header-meta">{tracks.length} songs</div>
        </div>
      </div>

      <div className="playlist-actions">
        {tracks.length > 0 && (
          <button className="play-btn large" onClick={handlePlay} aria-label={playlistIsPlaying ? "Pause playlist" : "Play playlist"}>
            {playlistIsPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        )}
        {playlists.length > 1 && (
          <button className="link-btn" onClick={handleDelete}>
            Delete playlist
          </button>
        )}
      </div>

      <div className="track-list">
        {tracks.length === 0 && <div className="state-message">This playlist is empty. Search for songs to add them here.</div>}
        {tracks.map((track, index) => (
          <TrackRow key={track.id} track={track} index={index} queue={tracks} playlistId={playlist.id} />
        ))}
      </div>
    </div>
  );
}
