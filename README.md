# Wedding Invitation Website

A single-page wedding invitation site with a royal maroon-and-gold theme —
photo hero with floral/mandala accents, a vertical "Our Story" timeline, a
celebration schedule, couple bios, a photo album, and a background-music
toggle — with scroll-reveal animations. Plain HTML/CSS/JS, no build step.
Fully responsive across small mobile, mobile, tablet, laptop, and large
desktop screens (see the breakpoints at the bottom of `css/style.css`).

## Customize

Everything you're likely to change lives in two places:

- `index.html` — couple names, hero date text, bios, section headings.
- `js/config.js` — wedding date/time (for the countdown), story milestones,
  event schedule, and album images. All images currently use placeholder
  photos from picsum.photos; replace a `photoSeed`/`albumImageSeeds` entry
  with a path like `"images/my-photo.jpg"` and update the corresponding
  `<img>`/background logic in `js/script.js` once you drop real photos into
  an `images/` folder.

### Background music

The music toggle (bottom-right) expects a file at `audio/wedding-music.mp3`.
No music is bundled — add your own licensed/royalty-free track at that path
and the toggle will play/pause it. Without a file present, the button still
works but there's nothing to play (fails silently).

## Run it

No build tools needed — it's static HTML. Two options:

```
# Option 1: just open it
double-click index.html

# Option 2: serve it locally (recommended, avoids browser file:// restrictions)
npx serve .
# or
python -m http.server 5500
```

Then visit the printed local URL (e.g. http://localhost:5500).
