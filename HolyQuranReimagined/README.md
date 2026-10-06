# المصحف — Reimagined

A clean-room, framework-free Quran reader designed for GitHub Pages.

## Features

- 604-page Quran reader using Arabic text derived from the supplied Quran dataset (the original implementation code is not used).
- Fast local search with Arabic normalization.
- Page/surah navigation.
- Ayah click-to-play using EveryAyah audio URLs.
- Multiple reciters.
- Meaning panel using the supplied meaning dataset.
- Bookmarks and local reading position.
- Light/dark/system theme.
- Responsive mobile layout with bottom audio dock.
- PWA/service-worker offline caching.
- Verse Studio with square/story/wide layouts, themes, animated preview, PNG export and WebM recording where supported.
- No build step, npm, server, or backend required.

## GitHub Pages

Upload the contents of this folder to a repository and enable GitHub Pages from the repository's root (or `/docs` if you move the files there). The application expects relative paths, so it also works under a project URL such as `https://username.github.io/repository/`.

## Local test

Because `fetch()` is used for the JSON datasets, serve the folder over HTTP:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Content / attribution

The Quran text and meanings JSON were generated from the data supplied with the user's existing project. The new application code, UI, architecture and styling were written independently and do not copy the existing application's source code.

The bundled Amiri/Cairo font files are content assets carried over for rendering. Verify their license/redistribution terms before publishing a public fork.

Audio is loaded from EveryAyah at playback time. Network availability is therefore required for audio unless you replace the audio URLs with locally hosted, appropriately licensed files.

## Important

This is a static client application. There is no secret API key in the repository and no server-side proxy. External audio requests go directly from the browser to EveryAyah.
