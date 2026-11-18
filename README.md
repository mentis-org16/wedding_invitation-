# Walima Invitation

A static React, Vite and TypeScript invitation website. It uses local copies of the reference site's decorative images, fonts, audio and favicon; it needs no server, API key, database or environment variable.

## Local development

Requires Node.js 22+ and the project-pinned pnpm 11.25.0. From the project directory:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Production build

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
```

Vite writes the deployable static site to `dist/`.

## Deploy to Vercel

1. Push this project to a Git repository and import that repository in Vercel.
2. Use the included `vercel.json` settings: install command `pnpm install --frozen-lockfile`, build command `pnpm build`, and output directory `dist`.
3. Select Node.js 22 or newer and deploy. No environment variables are required.

The application is a single-page invitation at `/`; it does not use client-side nested routes. The venue name, address and map control open the exact Google Maps search link in a new tab. The `Add to Calendar` control downloads `public/walima.ics`.

## Project files

- `src/components/EnvelopeIntro.tsx`: paper envelope and wax-seal opening sequence.
- `src/components/InvitationPanels.tsx`: the couple, date/countdown, venue and RSVP panels.
- `src/components/MusicDock.tsx`: reseal and ambient music controls.
- `src/data/invitation.ts`: supplied event, venue, host and RSVP data.
- `public/decor/`, `public/fonts/`, `public/ambience.mp3`: locally served original reference assets.
