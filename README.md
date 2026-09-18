# Spotify Update

A Spotify-style music player UI (forked from Grooveify) that searches and plays real songs from YouTube/YouTube Music, using Google's own official APIs.

## How playback works

This app does **not** rip or extract raw audio streams from YouTube — that would violate YouTube's Terms of Service and copyright law. Instead it uses two official Google APIs:

- **YouTube Data API v3** — searches YouTube for a song and returns matching videos (title, artist/channel, thumbnail, duration).
- **YouTube IFrame Player API** — loads Google's own embedded player (hidden off-screen) and controls it programmatically, so the custom UI here drives play/pause/seek/volume/next/prev while YouTube itself serves the actual audio/video.

This means you can search for and play virtually any song available on YouTube, fully within their terms.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Get a YouTube Data API v3 key (free)

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Go to **APIs & Services → Library**, search for **YouTube Data API v3**, and click **Enable**.
4. Go to **APIs & Services → Credentials → Create Credentials → API key**.
5. (Recommended) Restrict the key to the YouTube Data API v3 and to your local/dev HTTP referrers.

The free tier gives you 10,000 quota units/day; each search costs 100 units (~100 searches/day).

### 3. Add the key to your environment

```bash
cp .env.example .env
```

Then edit `.env`:

```
VITE_YOUTUBE_API_KEY=your_key_here
```

### 4. Run it

```bash
npm run dev
```

Without a key, the Search page will show a message pointing back here instead of crashing.

## Features

- Search any song/artist — pulled live from YouTube via the Data API
- Play/pause, next/previous, seek, and volume controls that drive a hidden YouTube IFrame player
- Build your own playlist by adding tracks from search results (persisted in `localStorage`)
- Genre shortcuts on the Home page that jump straight into a search
- Auto-skip if a particular video can't be embedded/played (e.g. embedding disabled by the uploader)

## Stack

React 19, Vite, React Router, YouTube Data API v3, YouTube IFrame Player API.

## Project structure

```
src/
  api/youtubeApi.js           YouTube Data API v3 search + duration lookup
  utils/youtubePlayerLoader.js  loads the YouTube IFrame Player script once
  context/PlayerContext.jsx   global playback state, wraps the hidden YT player
  components/                 Sidebar, Topbar, Player (bottom bar), TrackRow, icons
  pages/                      Home, Search, Playlist
```

## Note

This is a personal, non-commercial UI project built for learning purposes. It streams audio/video through YouTube's own official embedded player and APIs — no video/audio is downloaded, cached, or re-hosted by this app.
