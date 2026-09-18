# Spotify Update

A Spotify-style music player UI that searches and plays real songs from YouTube, using Google's official APIs.

**Live demo:** [https://spotify-clone-one-pearl.vercel.app/](https://spotify-clone-one-pearl.vercel.app/)

## Features

- Search any song or artist, with results pulled live from YouTube
- Play, pause, next, previous, seek and volume controls that drive a hidden YouTube player
- Build your own playlist by adding tracks from search results (saved in `localStorage`)
- Genre shortcuts on the Home page that jump straight into a search
- Auto-skip when a video cannot be played (for example, embedding disabled by the uploader)

## How the API is used

The app does **not** download, extract or re-host any audio or video. It uses two official Google APIs, and YouTube itself serves the media.

### 1. YouTube Data API v3 (search)

Code: [src/api/youtubeApi.js](src/api/youtubeApi.js)

Each search makes two requests to `https://www.googleapis.com/youtube/v3`:

| Request | Purpose | Key parameters |
| --- | --- | --- |
| `GET /search` | Find videos matching the query | `part=snippet`, `type=video`, `videoCategoryId=10` (Music), `videoEmbeddable=true`, `videoSyndicated=true`, `q=<your search>` |
| `GET /videos` | Look up each result's duration | `part=contentDetails`, `id=<comma-separated video ids>` |

What the app does with the results:

- Keeps only likely songs: durations from 45 seconds to 12 minutes, and skips titles that look like mixes, compilations, shorts, lyric videos, karaoke and similar
- Ranks official uploads first (channels ending in "- Topic", and VEVO), and moves live recordings down
- Returns `title`, `artist`, `thumbnail`, `durationSec` and `id` for each track

The key is read from the `VITE_YOUTUBE_API_KEY` environment variable. If it is missing, the Search page shows a message instead of crashing.

### 2. YouTube IFrame Player API (playback)

Code: [src/utils/youtubePlayerLoader.js](src/utils/youtubePlayerLoader.js) and [src/context/PlayerContext.jsx](src/context/PlayerContext.jsx)

The IFrame API script is loaded once from `https://www.youtube.com/iframe_api`. It creates an embedded YouTube player that is hidden off-screen. The custom player bar in this app calls that player's methods (play, pause, seek, volume, load video), so the UI is custom but the audio comes from YouTube's own player. This API needs no key.

### Quota

The free tier gives 10,000 quota units per day. One search costs 100 units and the duration lookup costs 1 unit, so you get about 100 searches per day. When the quota runs out, search returns an error until it resets.

## Run it locally

### 1. Prerequisites

- **Node.js 20.19 or newer** (or 22.12 or newer). This is required by Vite 8.
- Git

Check your version with `node -v`. If you use [nvm](https://github.com/nvm-sh/nvm), run `nvm install 22` and `nvm use 22`.

### 2. Clone and install

```bash
git clone https://github.com/devesh-mehra/spotify-clone.git
cd spotify-clone
npm install
```

### 3. Get a YouTube Data API key (free)

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project, or pick an existing one.
3. Go to **APIs & Services → Library**, search for **YouTube Data API v3** and click **Enable**.
4. Go to **APIs & Services → Credentials → Create Credentials → API key**.
5. Restrict the key (see [Keeping your key safe](#keeping-your-key-safe)).

### 4. Add the key

```bash
cp .env.example .env
```

Open `.env` and set your key:

```
VITE_YOUTUBE_API_KEY=your_key_here
```

The `.env` file is git-ignored, so it is never committed.

### 5. Start the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Creates a production build in `dist` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs the linter |

## Deploying to Vercel

The live demo is hosted on Vercel and rebuilds on every push to `main`.

1. Import the GitHub repo in Vercel.
2. Go to **Settings → Environment Variables** and add `VITE_YOUTUBE_API_KEY` with your key, for the Production environment.
3. **Redeploy.** Vite reads the variable at build time, so a deployment made before you added it will still show "Missing YouTube Data API key". After redeploying, hard refresh the site (Cmd + Shift + R) to skip the cached copy.

## Keeping your key safe

Variables that start with `VITE_` are built into the site's JavaScript, so anyone can read the key in the browser. Because of that:

- Never commit `.env`. Only `.env.example` (with no value) belongs in the repo.
- In Google Cloud, open the key and under **Application restrictions** choose **HTTP referrers**. Add `http://localhost:5173/*` and your Vercel address.
- Under **API restrictions**, allow only **YouTube Data API v3**.

## Troubleshooting

- **"Missing YouTube Data API key":** `.env` is missing or the variable name is wrong. It must be exactly `VITE_YOUTUBE_API_KEY`. Restart `npm run dev` after editing `.env`. On Vercel, add the variable and redeploy.
- **Search fails with a quota or 403 error:** the daily quota is used up, or the key's restrictions do not include the address you are using.
- **A song skips by itself:** the uploader has blocked that video from playing in embedded players, so the app moves to the next track.

## Tech stack

React 19, Vite, React Router, YouTube Data API v3, YouTube IFrame Player API.

## Project structure

```
src/
  api/youtubeApi.js             YouTube Data API v3 search and duration lookup
  utils/youtubePlayerLoader.js  loads the YouTube IFrame Player script once
  context/PlayerContext.jsx     global playback state, wraps the hidden YouTube player
  components/                   Sidebar, Topbar, Player (bottom bar), TrackRow, icons
  pages/                        Home, Search, Playlist
```

## Note

This is a personal, non-commercial project built for learning. Audio and video are streamed through YouTube's own embedded player and official APIs. Nothing is downloaded, cached or re-hosted by this app.
