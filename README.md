# Accessibility Quest 🎮♿

**Gamified Learning for Mobile Accessibility Guidelines**

Accessibility Quest is an interactive quiz app designed to teach students and developers about mobile accessibility standards, following WCAG principles. The app provides levels, points, and gamified feedback to improve learning outcomes.

---

## Features

- Gamified quizzes with levels and scores  
- Tracks progress locally per username  
- Supports dark/light mode and high contrast accessibility  
- Optional reduced motion for accessibility  
- Export participant results to CSV  

---

## Screenshots

*(Add screenshots or GIFs here)*

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/cc231027/AccessibilityQuest.git
cd AccessibilityQuest
````

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Start the Expo development server**

```bash
npm start
# or
yarn start
```

4. **Run on your device**

* Scan the QR code with Expo Go (iOS/Android)
* Or press `i` for iOS simulator, `a` for Android emulator

> Make sure you have [Node.js](https://nodejs.org/) and [Expo CLI](https://docs.expo.dev/workflow/expo-cli/) installed.

---

## Usage

1. Open the app and enter a **username** (no account required).
2. Navigate through levels and answer accessibility quizzes.
3. Track your progress locally.
4. Optionally, export all participant data as CSV via the admin/export feature.
5. Toggle dark/light mode, high contrast, sound, haptics, or reduced motion in settings.

---

## Developer Setup (Contributors)

1. **Run on simulator or device**

* iOS: Press `i` in the Expo CLI or run `expo start --ios`
* Android: Press `a` in the Expo CLI or run `expo start --android`

2. **Hot Reloading / Fast Refresh**

* Expo automatically reloads changes in JS/JSX files.
* Keep the terminal running `npm start` / `yarn start`.

3. **Test CSV Export**

* Run the app and complete some levels with different usernames.
* Use the “Export Participant Data” feature to generate a CSV file.
* The CSV is stored in the device cache and shared via system share dialog.

4. **Environment Variables**

* The project currently does not require `.env` files.
* If adding secrets or API keys, create `.env.local` and add it to `.gitignore`.

5. **Git Workflow for Contributors**

```bash
git checkout -b feature/my-new-feature
# make changes
git add .
git commit -m "Add new feature"
git push origin feature/my-new-feature
# then open a pull request
```

---

## Folder Structure

```
AccessibilityQuest/
├─ src/
│  ├─ screens/          # App screens (Start, Welcome, Quiz, Info)
│  ├─ theme/            # Theme and context (dark/light/high contrast)
│  ├─ hooks/            # Custom React hooks (progress tracking)
│  ├─ data/             # Quiz questions and levels
│  ├─ utils/            # Utility functions (export data, formatting)
├─ App.js               # Main entry point
├─ package.json
├─ .gitignore
└─ README.md
```

---

## GitHub Repository

[https://github.com/cc231027/AccessibilityQuest](https://github.com/cc231027/AccessibilityQuest)

---

## Credits

* **Author:** Augustine Onyirioha
* **Supervisor:** FH-Prof. Dr. Victor Adriel de Jesus Oliveira
* **Fonts:** [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk), [DM Sans](https://fonts.google.com/specimen/DM+Sans)
* **Libraries & Tools:**

  * [React Native](https://reactnative.dev/)
  * [Expo](https://expo.dev/)
  * [React Navigation](https://reactnavigation.org/)
  * [Expo LinearGradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)

---

## Notes

* Works on both iOS and Android devices via Expo Go.
* Progress is stored locally per username; no account is required.
* Designed with accessibility in mind: high contrast mode, reduced motion, and clear text for screen readers.
