const LIBRARY_ENDPOINT = "/data/library.json";

export async function fetchLibrary() {
  const response = await fetch(LIBRARY_ENDPOINT);
  if (!response.ok) {
    throw new Error(`Failed to load music library (${response.status})`);
  }
  const data = await response.json();
  return data.albums;
}

export async function fetchAlbumById(albumId) {
  const albums = await fetchLibrary();
  const album = albums.find((a) => a.id === albumId);
  if (!album) {
    throw new Error(`Album "${albumId}" not found`);
  }
  return album;
}
