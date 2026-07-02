/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StoredPDF, BestSetLog, DailyWeightLog, WeeklyCheckIn, AppSettings, ActiveWorkoutState } from "../types";

const DB_NAME = "LeanAndStrongTrackerDB";
const DB_VERSION = 1;
const STORE_PDFS = "pdfs";

// Initialize IndexedDB for PDFs
export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this environment."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("Database error:", event);
      reject(new Error("Failed to open database."));
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_PDFS)) {
        db.createObjectStore(STORE_PDFS, { keyPath: "weekNumber" });
      }
    };
  });
}

// Save PDF to IndexedDB
export async function savePDF(
  weekNumber: number,
  file: File,
  fileName: string
): Promise<StoredPDF> {
  const db = await initDB();
  return new Promise<StoredPDF>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => {
      reject(new Error("Failed to read file."));
    };

    reader.onload = () => {
      const dataUrl = reader.result as string;
      const storedPdf: StoredPDF = {
        weekNumber,
        fileName,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
        dataUrl,
      };

      const transaction = db.transaction(STORE_PDFS, "readwrite");
      const store = transaction.objectStore(STORE_PDFS);
      const request = store.put(storedPdf);

      request.onsuccess = () => {
        resolve(storedPdf);
      };

      request.onerror = () => {
        reject(new Error("Failed to save PDF to IndexedDB."));
      };
    };

    reader.readAsDataURL(file);
  });
}

// Get PDF by Week Number
export async function getPDF(weekNumber: number): Promise<StoredPDF | null> {
  try {
    const db = await initDB();
    return new Promise<StoredPDF | null>((resolve, reject) => {
      const transaction = db.transaction(STORE_PDFS, "readonly");
      const store = transaction.objectStore(STORE_PDFS);
      const request = store.get(weekNumber);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error("Failed to get PDF from IndexedDB."));
      };
    });
  } catch (err) {
    console.error("IndexedDB error:", err);
    return null;
  }
}

// Delete PDF by Week Number
export async function deletePDF(weekNumber: number): Promise<void> {
  const db = await initDB();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_PDFS, "readwrite");
    const store = transaction.objectStore(STORE_PDFS);
    const request = store.delete(weekNumber);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error("Failed to delete PDF."));
    };
  });
}

// local storage keys
const KEY_BEST_SETS = "lean_strong_best_sets";
const KEY_WEIGHTS = "lean_strong_weights";
const KEY_CHECKINS = "lean_strong_checkins";
const KEY_SETTINGS = "lean_strong_settings";
const KEY_ACTIVE_WORKOUT = "lean_strong_active_workout";
const KEY_EXERCISE_SWAPS = "lean_strong_exercise_swaps";

// Helper to load/save from local storage
export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading key "${key}" from localStorage:`, error);
    return defaultValue;
  }
}

export function saveToLocalStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving key "${key}" to localStorage:`, error);
  }
}

// Specific LocalStorage getters & setters
export const getBestSetLogs = (): Record<string, BestSetLog> =>
  loadFromLocalStorage<Record<string, BestSetLog>>(KEY_BEST_SETS, {});

export const saveBestSetLogs = (logs: Record<string, BestSetLog>) =>
  saveToLocalStorage(KEY_BEST_SETS, logs);

export const getDailyWeightLogs = (): DailyWeightLog[] =>
  loadFromLocalStorage<DailyWeightLog[]>(KEY_WEIGHTS, []);

export const saveDailyWeightLogs = (logs: DailyWeightLog[]) =>
  saveToLocalStorage(KEY_WEIGHTS, logs);

export const getWeeklyCheckIns = (): WeeklyCheckIn[] =>
  loadFromLocalStorage<WeeklyCheckIn[]>(KEY_CHECKINS, []);

export const saveWeeklyCheckIns = (checkins: WeeklyCheckIn[]) =>
  saveToLocalStorage(KEY_CHECKINS, checkins);

export const getAppSettings = (): AppSettings => {
  const defaultSettings: AppSettings = {
    startDate: new Date().toISOString().split("T")[0],
    units: "imperial",
    timerDuration: 90, // default 90 seconds (1.5 mins)
    soundEnabled: true,
    completedDays: {},
  };
  return loadFromLocalStorage<AppSettings>(KEY_SETTINGS, defaultSettings);
};

export const saveAppSettings = (settings: AppSettings) =>
  saveToLocalStorage(KEY_SETTINGS, settings);

export const getActiveWorkout = (): ActiveWorkoutState | null =>
  loadFromLocalStorage<ActiveWorkoutState | null>(KEY_ACTIVE_WORKOUT, null);

export const saveActiveWorkout = (state: ActiveWorkoutState | null) =>
  saveToLocalStorage(KEY_ACTIVE_WORKOUT, state);

export const getExerciseSwaps = (): Record<string, string> =>
  loadFromLocalStorage<Record<string, string>>(KEY_EXERCISE_SWAPS, {});

export const saveExerciseSwaps = (swaps: Record<string, string>) =>
  saveToLocalStorage(KEY_EXERCISE_SWAPS, swaps);

// Reset database to default
export async function clearAllDatabase(): Promise<void> {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(KEY_BEST_SETS);
    window.localStorage.removeItem(KEY_WEIGHTS);
    window.localStorage.removeItem(KEY_CHECKINS);
    window.localStorage.removeItem(KEY_SETTINGS);
    window.localStorage.removeItem(KEY_ACTIVE_WORKOUT);
    window.localStorage.removeItem(KEY_EXERCISE_SWAPS);

    // clear IndexedDB pdfs store
    try {
      const db = await initDB();
      const transaction = db.transaction(STORE_PDFS, "readwrite");
      const store = transaction.objectStore(STORE_PDFS);
      store.clear();
    } catch (e) {
      console.error("Could not clear IndexedDB:", e);
    }
  }
}
