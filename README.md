# Grooveify — Spotify Clone

A responsive music streaming interface built with React, inspired by Spotify.

## Features

- Song playback with play/pause, next/previous, seek, and volume controls
- Track selection from album pages, the home grid, and a live search across the whole catalog
- Dynamic display of song info (title, artist, cover art, elapsed/total time) that updates as the audio plays
- Data layer (`src/api/musicApi.js`) that fetches the music catalog asynchronously, mirroring how the app would talk to a real backend API
- Reusable components (`AlbumCard`, `TrackRow`, `Player`, `Sidebar`) and a shared `PlayerContext` for global playback state

## Stack

React 19, Vite, React Router.

## Getting started

```bash
npm install
npm run dev
```

## Project structure

```
src/
  api/           fetch layer for the music catalog
  components/    reusable UI pieces (sidebar, player, track rows, cards, icons)
  context/       PlayerContext — global playback state and <audio> control
  pages/         Home, Album, Search
public/data/     the music catalog served as JSON
```

## Note

This is a personal, non-commercial UI clone built for learning purposes.
Track metadata references real song titles/artists for demo purposes only;
playback audio uses royalty-free sample tracks.
