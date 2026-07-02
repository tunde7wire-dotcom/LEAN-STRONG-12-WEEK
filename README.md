# 12-Week Lean & Strong Plan Tracker

Welcome to the **12-Week Lean & Strong Tracker**—a premium, offline-first, mobile-optimized physical training and nutritional journal designed specifically for iPhone Safari ("Add to Home Screen") and standard browsers. 

This tracker enforces the core progressive overload, double-progression rules, active deload phases, and hydration guidelines detailed in the **12-Week Lean + Strong Plan**.

---

## 📱 Core Features

1. **Today Dashboard**: Check your live plan position (Week 1–12, Day Mon–Sun), track today's target strength or recovery guidelines, log daily morning weights, and note performance cues.
2. **Roadmap & Weekly Dashboard**: View the full 12-week layout. Navigate directly to any week's planner to check strength volume splits, rest schedule, and macro guides.
3. **Workout Experience (Best-Set Logging)**: Log only your "Best Set" (Weight x Reps) per movement to reduce cognitive friction. View previous session data side-by-side to ensure you beat yesterday's numbers.
4. **Persistent Rest Timer**: A floating, circular countdown timer that continues counting down in the background if the page refreshes or minimizes. Emits an offline-friendly double beep upon completion using Web Audio API.
5. **Dynamic Exercise Swaps**: Swap any movement (e.g. Smith Squat for Goblet Squat) with specialized alternative suggestions or enter custom labels. All swaps persist.
6. **IndexedDB PDF Meal Plans & Grocery Lists**: Rather than copying complex schedules, upload actual PDF meal plans per week. PDFs are stored natively in the browser via IndexedDB and dynamically swap as you change weeks.
7. **Cooking Prep Lab**: An advanced text editor seeded with science-based cooking guidelines, moisture control hacks, and starch-preservation tricks to keep meal preps fresh.
8. **Biometrics Engine**: Log fasted morning weight. The tracker automatically calculates and plots your Weekly Average weight across all 12 weeks to capture true composition trends.

---

## 🛠️ Visual & Aesthetic Guidelines
Designed like a luxury Swiss timepiece:
- **Monochrome Minimalist Theme**: Strict pitch black and elegant white pairing with sharp borders and zero decorative clutter.
- **Apple-Native Feel**: Large tap targets (44px), physical status logs, custom iOS safe-area-insets, and momentum-scrolling lists.
- **No Telemetry Slop**: Zero unrequested fake status counters, ping lines, or container ports in the page margins. Just pristine, clean content layout.

---

## 🚀 Easy Local Setup

To run this application locally on your computer:

1. **Clone or Download** the source files.
2. Open your terminal inside the project directory.
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Launch development server**:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser. Right-click and choose **Inspect** -> **Toggle Device Toolbar** -> select **iPhone** to preview the target iOS feel.

---

## 📦 Deploying to GitHub Pages

The project comes pre-configured with a GitHub Actions workflow to publish automatically:

1. **Create a new GitHub Repository** (e.g. `lean-strong-tracker`).
2. Push your local files to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "feat: init tracker codebase"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```
3. **Configure GitHub Pages settings**:
   - Go to your repository on GitHub.
   - Click **Settings** -> **Pages** (in the left-hand menu).
   - Under **Build and deployment** -> **Source**, make sure it is set to **Deploy from a branch** or **GitHub Actions**.
   - If utilizing the Actions workflow, the `.github/workflows/deploy.yml` file will automatically compile and deploy your code onto a static hosting branch called `gh-pages` every time you push to `main`!

---

## 📚 Technical Architecture Details
- **Frontend Stack**: React 19, TypeScript, Vite 6, Tailwind CSS v4.
- **Service Worker (`public/sw.js`)**: Implements standard Service Worker caching. Automatically caches static page assets (`index.html`, `manifest.json`, styles) supporting immediate offline access.
- **Storage Strategy**:
  - **IndexedDB**: Handled via custom transaction wrappers in `src/utils/db.ts` to host high-density base64-encoded PDF documents offline.
  - **LocalStorage**: Handles lightweight state variables such as active workout timers, start dates, units preferences, and logged set weights.
- **Timer Sound Node**: Generates high-frequency sine tones using raw browser `AudioContext` nodes. Works without downloading external audio file assets.
