# PT 3D Fighting Studio

Browser-based 3D fighting animation playground built with Vite and Three.js.

## V1 features
- Procedural boxing arena and two stylized fighters
- Idle, Punch, Kick, Sweep, Block and Dodge action previews
- Orbit / zoom camera controls
- Playback, stop, timeline scrubber and speed control
- Fighter color controls and fullscreen viewport
- WebM recording through the browser MediaRecorder API

## Run locally
Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

V1 uses procedural placeholder characters and simplified pose animation. Mixamo/GLB/FBX import, motion-captured choreography, physics simulation and MP4 export are not included yet. Recordings remain local in the browser.
