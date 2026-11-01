# iOS and Android app setup

The web studio is configured for **Capacitor 8**, which packages the existing Vite + Three.js app into native iOS and Android projects.

- App name: PT Fighting Studio
- App ID: `com.ptcodelabs.fightingstudio`
- Web output: `dist`

## First-time setup

Install Node.js 22 or newer, then run:

```bash
npm install
npm run mobile:add:android
npm run mobile:add:ios
npm run mobile:sync
```

Open native projects:

```bash
npm run mobile:open:android
npm run mobile:open:ios
```

After editing the web app, run `npm run mobile:sync` to rebuild and copy web assets into the native projects.

## Requirements and limitations
- iOS compilation/signing requires macOS and Xcode.
- Android compilation requires Android Studio and Android SDK.
- App Store / Play Store publishing requires signing, app icons, screenshots, privacy disclosures and store review.
- Existing 9:16 export uses browser MediaRecorder and WebM. Test it in iOS/Android WebViews; native Photos/Gallery saving and MP4 conversion are not integrated yet.
- This setup does not yet add cloud accounts, project sync or native editing APIs.
