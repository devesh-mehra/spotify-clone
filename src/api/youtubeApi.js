const API_BASE = "https://www.googleapis.com/youtube/v3";
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export class MissingApiKeyError extends Error {
  constructor(message) {
    super(message);
    this.name = "MissingApiKeyError";
  }
}

export function hasApiKey() {
  return Boolean(API_KEY);
}

// Titles containing these are almost always compilations/mixes/jukeboxes rather than a single song,
// which the Data API v3 has no dedicated flag for (unlike YouTube Music's internal, undocumented API).
const NON_SONG_KEYWORDS = [
  "shorts",
  "#shorts",
  "mix",
  "megamix",
  "nonstop",
  "playlist",
  "compilation",
  "jukebox",
  "full album",
  "greatest hits",
  "top 10",
  "top 20",
  "top 50",
  "top songs",
  "top hits",
  "trending songs",
  "best songs",
  "hour loop",
  "hours loop",
  "minute loop",
  "minutes loop",
  "10 minutes",
  "20 minute",
  "1 hour",
  "one hour",
  "lyrics",
  "lyric video",
  "instrumental",
  "karaoke",
  "acapella",
  "8d audio",
  "dolby atmos",
  "slowed",
  "sped up",
  "reverb",
  "reaction",
  "how to play",
  "tutorial",
  "cover by",
  "(cover)",
  "behind the scenes",
  "making of",
];

// Auto-generated "Artist - Topic" channels and VEVO are YouTube's own canonical
// upload source for an artist's official audio/video, closest thing to "the song itself."
function isOfficialChannel(channelTitle) {
  const lower = (channelTitle || "").toLowerCase();
  return lower.endsWith("- topic") || lower.includes("vevo");
}

// Strips channel-name artifacts ("The Weeknd - Topic", "TheWeekndVEVO") down to a
// plain artist name that's usable as a search query for that artist's other songs.
export function cleanArtistName(channelTitle) {
  return (channelTitle || "")
    .replace(/\s*-\s*topic$/i, "")
    .replace(/vevo$/i, "")
    .trim();
}

// Loose title match so we don't recommend "Blinding Lights (Live)" right after
// "Blinding Lights (Official Video)" just finished playing.
export function normalizeTitle(title) {
  return (title || "")
    .toLowerCase()
    .replace(/\(.*?\)|\[.*?\]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Deprioritize (not exclude) obvious live recordings, since a bare "live" substring
// would also match legitimate song titles like "Live and Let Die".
function hasLiveMarker(title) {
  return /\(live[^)]*\)|\blive at\b|\blive from\b|\blive on\b|\blive in\b|-\s*live\b/i.test(title);
}

// Shorts run well under a minute; compilations/mixes run well past a typical song's length.
const MIN_SONG_SECONDS = 45;
const MAX_SONG_SECONDS = 12 * 60;

function isLikelySong(title, durationSec) {
  if (durationSec != null && (durationSec < MIN_SONG_SECONDS || durationSec > MAX_SONG_SECONDS)) {
    return false;
  }
  const lower = title.toLowerCase();
  return !NON_SONG_KEYWORDS.some((keyword) => lower.includes(keyword));
}

export async function searchTracks(query, { maxResults = 20 } = {}) {
  if (!API_KEY) {
    throw new MissingApiKeyError(
      "Missing YouTube Data API key. Add VITE_YOUTUBE_API_KEY to your .env file (see README)."
    );
  }

  const searchUrl = new URL(`${API_BASE}/search`);
  searchUrl.search = new URLSearchParams({
    key: API_KEY,
    part: "snippet",
    type: "video",
    videoCategoryId: "10", // Music
    videoEmbeddable: "true", // exclude videos the uploader blocked from embedding
    videoSyndicated: "true", // exclude videos restricted to youtube.com playback only
    // request extra raw results since the song/shorts/mix filter below removes some of them
    maxResults: String(Math.min(maxResults + 15, 50)),
    q: query,
  }).toString();

  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) {
    const body = await searchRes.json().catch(() => null);
    throw new Error(body?.error?.message || `YouTube search failed (${searchRes.status})`);
  }
  const searchData = await searchRes.json();
  const items = (searchData.items || []).filter((item) => item.id?.videoId);
  if (items.length === 0) return [];

  const durations = await fetchDurations(items.map((item) => item.id.videoId));

  const tracks = items
    .map((item) => ({
      id: item.id.videoId,
      title: decodeHtml(item.snippet.title),
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || "",
      durationSec: durations[item.id.videoId] ?? null,
    }))
    .filter((track) => isLikelySong(track.title, track.durationSec));

  // Stable sort: official artist/Topic/VEVO uploads first, live recordings pushed down
  // within each tier, everything else keeps its original relevance order.
  const ranked = tracks
    .map((track, index) => ({
      track,
      index,
      officialRank: isOfficialChannel(track.artist) ? 0 : 1,
      liveRank: hasLiveMarker(track.title) ? 1 : 0,
    }))
    .sort((a, b) => a.officialRank - b.officialRank || a.liveRank - b.liveRank || a.index - b.index)
    .map(({ track }) => track);

  return ranked.slice(0, maxResults);
}

async function fetchDurations(videoIds) {
  if (videoIds.length === 0) return {};
  const url = new URL(`${API_BASE}/videos`);
  url.search = new URLSearchParams({
    key: API_KEY,
    part: "contentDetails",
    id: videoIds.join(","),
  }).toString();

  const res = await fetch(url);
  if (!res.ok) return {};
  const data = await res.json();
  const map = {};
  for (const item of data.items || []) {
    map[item.id] = parseIsoDuration(item.contentDetails?.duration);
  }
  return map;
}

function parseIsoDuration(iso) {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso || "");
  if (!match) return null;
  const [, h, m, s] = match;
  return (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0);
}

function decodeHtml(text) {
  const el = document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
}
