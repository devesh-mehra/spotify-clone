import AlbumCard from "../components/AlbumCard";

export default function Home({ albums, loading, error }) {
  const greeting = getGreeting();

  if (loading) return <div className="state-message">Loading your music…</div>;
  if (error) return <div className="state-message error">{error}</div>;

  return (
    <div className="home-page">
      <h1 className="page-heading">{greeting}</h1>
      <section>
        <h2 className="section-heading">Made for you</h2>
        <div className="album-grid">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
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
