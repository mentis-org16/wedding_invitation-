# Walima invitation recreation — implementation plan

## Reference and design direction

Use the exact botanical fine-paper invitation aesthetic of [the reference](https://nikkah-invitation.spextacle.com/), not a new or “inspired by” design. Desktop inspection confirmed a pale paper-and-silk opening envelope with wax seal, then four full-screen panels in this order: couple, date/countdown, venue, RSVP. The live source exposes the original CSS/JS, exact font names and localizable decorative assets. The four invitation panels use the original floral arch, embossed paper and linen-floral backgrounds; details include the gajra ornament, bow, wax seal and falling petals. The original palette includes paper ivory (`#f9f7f1`), sage (`#55654c`, `#44523d`), muted blush (`#dcb8ab`) and warm ink (`#34322d`). Reuse the reference’s Cormorant Garamond, Marcellus, Great Vibes and Amiri Quran families and self-host the files so the Vercel build does not depend on a live font provider.

- **Design movement:** the original botanical, fine-paper wedding invitation, reproduced rather than reinterpreted.
- **Core principles:** preserve the source’s hierarchy; use its pale paper, sage and blush tones; keep ornamentation delicate and sparse; make the four panels feel like pages of one invitation.
- **Color philosophy:** retain the reference’s warm paper ground and restrained sage/blush accents; add no new palette.
- **Layout paradigm:** a fixed, full-viewport invitation with one centered panel at a time, the source’s fixed navigation dots and lower audio/reseal dock, and viewport-aware scaling instead of a conventional scrolling landing page.
- **Signature elements:** the opening envelope and wax seal; botanical floral-arch/linen backgrounds; original script and serif typography.
- **Interaction philosophy:** preserve the seal-to-open reveal and direct section navigation; support keyboard and touch navigation; provide explicit audio and reseal controls.
- **Animation:** reproduce the envelope unfolding, petal reveal, panel entrance/exit, decorative motion and background breathing, using source-derived timing/easing where available. The original background breathing cycle is 26 seconds. Use reduced-motion handling without creating layout shifts.
- **Typography:** Cormorant Garamond for display text, Marcellus for labels/body, Great Vibes for script emphasis, and Amiri Quran for the original Arabic line.
- **Brand essence:** an intimate, graceful Walima invitation; elegant, warm, composed.
- **Brand voice:** retain the reference’s short, formal invitation phrasing; examples: “Save the evening” and “You are warmly invited to the Walima of”.
- **Wordmark and logo:** do not invent a new wordmark; retain the original wax-seal motif and use the source favicon as the site icon.
- **Signature brand color:** the source sage green `#55654c`.

## Content and behavior

Replace the Nikkah-specific copy with the supplied Walima information only. The bride’s displayed text will be exactly “Daughter of Syed Sibt-e-Hassan Raza”; no personal name will be added. The date panel will show Sunday, 29 November 2026 and Dinner, 8:00 PM. The venue panel will show “The Mark Suites & Banquet Halls” and “01, Club Road, Near Rawal Dam, Islamabad, Pakistan.” Both venue name/address and the location control will open the exact supplied Google Maps URL. The final panel will preserve the original RSVP/closing hierarchy while displaying the four exact RSVP names and the “Looking Forward” hosts, with the two supplied numbers. The host numbers can link to the phone dialer.

The reference RSVP button is hard-coded to the original family’s WhatsApp number, which must not be reused for this invitation. No RSVP destination number or guest-count behavior was supplied, so the replacement will show the requested RSVP names and supplied host contacts rather than inventing a new WhatsApp recipient or an unsupported RSVP flow. The original “Add to Calendar” interaction will be retained with a downloadable event entry for the supplied date/time and venue; no event duration will be assumed. The public ambience MP3 is accessible and will be bundled locally. Audio will start only after the user opens the envelope or presses play, and the control will provide working play/pause behavior under browser autoplay restrictions.

## Implementation and project structure

Use a static React + Vite + TypeScript website; do not add a backend, database or login. Reuse the reference’s public images, favicon and ambience track as local files and use self-hosted font files. Use CSS for the paper/background treatment and motion, with small TypeScript components for the envelope, four-panel navigation, audio dock and event data. Avoid introducing an animation dependency unless implementation shows CSS/JS cannot reproduce a specific source behavior closely enough.

```text
src/
  App.tsx                 Invitation stage and top-level state
  main.tsx                React entry point
  data/invitation.ts      Exact event, venue, host and RSVP copy
  components/
    EnvelopeIntro.tsx     Opening and reseal interaction
    InvitationPanels.tsx  Four panels and section navigation
    MusicDock.tsx         Audio and reset controls
  styles.css              Source-matched typography, layout and animations
public/
  decor/                  Reused reference webp illustrations/backgrounds
  fonts/                  Self-hosted original font files
  ambience.mp3            Reused source ambience audio
  walima.ics              Calendar event with date/time and no invented duration
  favicon.svg             Reused source icon
  manus-routes.json       Declares the single `/` page
plan.md                   This approved implementation plan
TODO.md                   Outcome-based criteria, created after plan approval
app.config.ts             Platform logo metadata
vercel.json               Vercel static Vite build settings
```

Use pnpm with a pinned package-manager version and a reviewed pnpm 11 `allowBuilds` policy before installation. Keep the production output in `dist/`, provide the standard Vercel build/output settings, and document the Vercel import/build steps. The single-page site has only `/`; it needs no application server or client-side router. The platform preview will use the project’s configured runtime port and the required static route manifest.

## Validation and known limitation

Run the TypeScript diagnostics and production build. Check the route manifest and exact event/Maps URL in source. Exercise the envelope open/reseal, all four navigation controls, keyboard/touch transitions, audio toggle, host phone links and calendar file. Capture the recreation at 375, 390, 430, 768, 1024 and 1440 pixel widths and inspect for overflow, incorrect wrapping, missing assets and layout shifts.

The reference browser exposed a fixed desktop viewport and ignored `window.resizeTo(390,844)`, so I could not capture its own live page at a phone-sized viewport. Its responsive CSS and mobile breakpoints were inspected directly. The recreated website will still be tested at the requested phone/tablet widths, but a pixel-for-pixel comparison against an actual mobile rendering of the reference cannot be claimed unless a mobile viewport becomes available. No other inspected reference element needs substitution: the opening, four panels, assets, fonts, music and desktop interactions were accessible.