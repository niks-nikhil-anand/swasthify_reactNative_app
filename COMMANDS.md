# Swasthify - Development Commands & Setup Guide

This document contains step-by-step commands to set up, run, and troubleshoot the **Swasthify** React Native application.

---

## 1. Initial Setup & Dependencies

### Install Project Dependencies
Run this in the project root to install all required packages and apply patches (e.g. `patch-package`):
```bash
npm install
```

### Fix File Permissions (If sudo was previously used)
If you encounter permission issues (`EACCES`), reset ownership to your current user:
```bash
sudo chown -R $(whoami) ~/.npm /Users/nikhil/Desktop/swasthify_reactNative_app
```

---

## 2. Running on Android

### Step 1: Start the Android Emulator
Launch the configured virtual device (`Pixel_10_Pro_XL`):
```bash
emulator -avd Pixel_10_Pro_XL
```
> *Alternatively, open **Android Studio** → **Device Manager** → click the **Play (▶)** button next to `Pixel_10_Pro_XL`.*

### Step 2: Start the Metro Bundler
Open a new terminal tab and start the JavaScript bundler:
```bash
npm start
```
*(Keep this terminal running).*

### Step 3: Build & Launch App on Android
In another terminal tab:
```bash
npm run android
```

---

## 3. Running on iOS (macOS)

### Step 1: Install CocoaPods (First-time / Dependency updates)
```bash
cd ios
pod install
cd ..
```

### Step 2: Start Metro Bundler
```bash
npm start
```

### Step 3: Build & Launch App on iOS Simulator
```bash
npm run ios
```

---

## 4. Troubleshooting & Helpful Fixes

### Fix `EADDRINUSE: address already in use :::8081`
If port 8081 is already in use by a previous Metro instance or background process, kill it:
```bash
# Option 1: Using kill-port
npx kill-port 8081

# Option 2: Using lsof kill command
lsof -ti:8081 | xargs kill -9
```

### Reset Metro Cache
If changes are not reflecting or you encounter bundle caching issues:
```bash
npm start -- --reset-cache
```

### Clean Android Build Cache
If you encounter Android build/Gradle errors:
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Reinstall node_modules Cleanly
If packages or lockfiles get corrupted:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Fix `No space left on device` (Gradle / Disk Full Error)
If Gradle fails with `java.io.IOException: No space left on device`, clear caches to free up 15-25+ GB:
```bash
# 1. Clean npm cache (often takes 15-20 GB)
npm cache clean --force

# 2. Clear corrupted Gradle transforms & caches
rm -rf ~/.gradle/caches/

# 3. Clean Gradle build in project
cd android && ./gradlew clean && cd ..
```

