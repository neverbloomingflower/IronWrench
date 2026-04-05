# IronWrench — Setup Guide for Windows

## What You Need First (Install These Once)

### 1. Node.js
Download from: https://nodejs.org  
Choose the "LTS" version. Install it normally.
After installing, open CMD and verify:
```
node --version
npm --version
```

### 2. Git (optional but useful)
Download from: https://git-scm.com

---

## Step 1 — Open the Project

Open Windows CMD and navigate to the IronWrench folder:
```
cd C:\path\to\IronWrench
```

---

## Step 2 — Add Your API Key

Open `src\theme.ts` in any text editor (Notepad, VS Code, etc.)
Find this line:
```
export const ANTHROPIC_API_KEY = 'YOUR_API_KEY_HERE';
```
Replace `YOUR_API_KEY_HERE` with your actual Anthropic API key.
Get one at: https://console.anthropic.com

---

## Step 3 — Install Dependencies

In CMD, inside the IronWrench folder, run:
```
npm install
```
This will take 1-3 minutes. Wait for it to finish.

---

## Step 4 — Install Expo CLI

```
npm install -g expo-cli
```

---

## Step 5 — Run the App

### On your PC (in a browser):
```
npx expo start --web
```
Then press `W` — a browser window will open with the full app.

### On your Android phone:
1. Install "Expo Go" from the Google Play Store
2. Run: `npx expo start`
3. Scan the QR code shown in CMD with the Expo Go app
4. The app loads instantly on your phone!

### On your iPhone:
1. Install "Expo Go" from the App Store
2. Run: `npx expo start`
3. Open the Camera app and scan the QR code
4. Tap the Expo Go notification

---

## Building a Real Installable App

### Android APK (install directly on Android):
```
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```
This gives you a downloadable APK file.

### Full Android App Store build:
```
eas build --platform android
```

### Windows Desktop App:
```
npx expo start --web
```
Then use Ctrl+P in Chrome → Save as Desktop App (PWA)
Or use Electron to wrap it for a true .exe

---

## Troubleshooting

**"command not found" errors:**
Make sure Node.js is installed and restart CMD

**"port in use" error:**
Run `npx expo start --port 8082`

**App won't connect on phone:**
Make sure your phone and PC are on the same WiFi network

**API not working:**
Double-check your API key is correctly pasted in `src\theme.ts`
Make sure you have credits in your Anthropic account

---

## Project File Structure

```
IronWrench\
├── app\                    ← All screens
│   ├── _layout.tsx         ← Navigation setup
│   ├── index.tsx           ← Home screen
│   ├── builder.tsx         ← Custom builder (4-step)
│   ├── diagnostic.tsx      ← AI engine diagnostics
│   ├── gallery.tsx         ← Community gallery
│   └── garage.tsx          ← Profile & saved builds
├── src\
│   ├── theme.ts            ← Colors + YOUR API KEY goes here
│   ├── data\
│   │   └── bikes.ts        ← All bike/mod/gallery data
│   └── services\
│       └── anthropic.ts    ← Claude AI integration
├── package.json
└── app.config.ts
```

---

Built with Expo + React Native + Claude AI
