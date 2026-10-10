# Afterface — standalone Android app

Offline face-swap app packaged as a native Android project (WebView shell + bundled MediaPipe assets).

## Features

- Pick a **portrait** and **video** from device storage
- Set **start / end** trim points on the clip
- **Expression** slider (follows smile / talk / blink from the clip)
- Process entirely **on-device** (no network after install)
- **Save** the result via share sheet or download

## Requirements to build

- Android Studio Hedgehog (2023.1.1) or newer  
- JDK 17  
- Android SDK 34  

## Build an APK

1. Open the `AfterfaceAndroid` folder in **Android Studio**.
2. Let Gradle sync (it downloads the Gradle wrapper and dependencies the first time).
3. Connect a phone or start an emulator (API 26+).
4. **Run** ▸ app, or:

   ```bash
   # from this folder, after Android Studio has generated gradlew
   ./gradlew assembleDebug
   ```

   APK path:

   ```
   app/build/outputs/apk/debug/app-debug.apk
   ```

5. Install on a phone:

   ```bash
   adb install -r app/build/outputs/apk/debug/app-debug.apk
   ```

## Release build

```bash
./gradlew assembleRelease
```

Sign the APK/AAB with your keystore before publishing.

## Project layout

```
AfterfaceAndroid/
├── app/
│   ├── build.gradle
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/afterface/app/MainActivity.java
│       ├── assets/www/          ← offline UI + MediaPipe model
│       └── res/
├── build.gradle
├── settings.gradle
└── gradle.properties
```

`MainActivity` is a full-screen WebView that loads `file:///android_asset/www/index.html`.  
The face engine (WASM + `.task` model) is bundled under `assets/www/`.

## Limits

- Processes about the first **8 seconds** of the selected range  
- Output capped near **480px** on the long edge for phone performance  
- Works best with a clear, front-facing face  

## Package id

`com.afterface.app`

## GitHub Actions

Every push to `main` builds a debug APK. Download it from the workflow run **Artifacts** → `afterface-debug-apk`.

You can also run the workflow manually: **Actions → Build Android APK → Run workflow**.

MediaPipe `.wasm` / `.task` binaries are downloaded during CI (and via `scripts/fetch-assets.sh` for local builds).

## Local asset fetch

```bash
./scripts/fetch-assets.sh
```
