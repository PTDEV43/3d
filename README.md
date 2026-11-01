# PT 3D Fighting Studio

Browser-based 3D fighting animation studio built with Vite, Three.js and Capacitor.

## Current features
- Procedural boxing arena and two stylized fighters
- Idle, Punch, Kick, Sweep, Block and Dodge previews
- Orbit / zoom camera, playback, timeline scrubber and speed control
- Fighter color controls and fullscreen viewport
- Vertical 9:16 WebM recording target (1080 × 1920)
- Capacitor 8 configuration for iOS and Android

## Run web app
Requires Node.js 22 or newer.
```bash
npm install
npm run dev
```

## iOS and Android
See [MOBILE_SETUP.md](./MOBILE_SETUP.md). Native platform projects are generated locally using Capacitor CLI; they are not included until created and reviewed.

## Build
```bash
npm run build
npm run preview
```

## Not implemented yet
Multi-clip timeline editing, audio tracks, transitions, text overlays, model import, motion capture, native gallery saving and MP4 conversion. Current recorder outputs WebM and requires testing in each native WebView. iOS builds require macOS + Xcode; Android builds require Android Studio + Android SDK.
