# Spotify Update

A Spotify-style music player that searches and plays real songs from YouTube.

**Live demo:** [https://spotify-clone-one-pearl.vercel.app/](https://spotify-clone-one-pearl.vercel.app/)

## Features

- Search any song or artist
- Play, pause, next, previous, seek and volume controls
- Build your own playlist (saved in your browser)
- Genre shortcuts on the Home page

## How it works

- **Search:** uses the YouTube Data API v3 ([src/api/youtubeApi.js](src/api/youtubeApi.js)).
- **Playback:** uses the YouTube IFrame Player API, hidden behind a custom player bar ([src/context/PlayerContext.jsx](src/context/PlayerContext.jsx)).

Nothing is downloaded or re-hosted. YouTube serves all the audio and video.

## Run it locally

You need Node.js 20.19+ and a free [YouTube Data API key](https://console.cloud.google.com/) (enable **YouTube Data API v3**, then create an API key).

```bash
git clone https://github.com/devesh-mehra/spotify-clone.git
cd spotify-clone
npm install
cp .env.example .env
```

Put your key in `.env`:

```
VITE_YOUTUBE_API_KEY=your_key_here
```

Then start the app:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Deploying

On Vercel, add `VITE_YOUTUBE_API_KEY` under **Settings → Environment Variables**, then redeploy.

## Notes

- The free API quota allows about 100 searches per day.
- The key is visible in the built site, so restrict it to your domains and to YouTube Data API v3 in Google Cloud.
- If a song skips by itself, the uploader has blocked embedding.

## Tech stack

React 19, Vite, React Router, YouTube APIs.

*A personal project built for learning.*
