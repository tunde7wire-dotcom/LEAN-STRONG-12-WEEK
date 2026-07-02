export interface BackupData {
  format: "lean-strong-tracker-backup";
  schemaVersion: number;
  exportedAt: string;
  appVersion?: string;
  data: {
    localStorage: Record<string, any>;
    indexedDB: Record<string, any>;
  };
}

export const APP_LOCAL_STORAGE_KEYS = [
  "lean_strong_best_sets",
  "lean_strong_weekly_best_sets",
  "lean_strong_weights",
  "lean_strong_checkins",
  "lean_strong_settings",
  "lean_strong_active_workout",
  "lean_strong_exercise_swaps"
];

// Helper to also get week notes (lean_strong_note_WX_DY) and prep notes
export function getAppLocalStorageKeys(): string[] {
  if (typeof window === "undefined") return [];
  const keys: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key && key.startsWith("lean_strong_")) {
      keys.push(key);
    }
  }
  return keys;
}

export async function collectBackupData(): Promise<BackupData> {
  const localStorageData: Record<string, any> = {};
  const keys = getAppLocalStorageKeys();
  for (const key of keys) {
    const item = window.localStorage.getItem(key);
    if (item !== null) {
      try {
        localStorageData[key] = JSON.parse(item);
      } catch (e) {
        // Not JSON or corrupted, store as string? App saves everything as JSON strings.
        localStorageData[key] = item;
      }
    }
  }

  // We are not exporting PDF binaries, so indexedDB will be empty for now.
  const backup: BackupData = {
    format: "lean-strong-tracker-backup",
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    data: {
      localStorage: localStorageData,
      indexedDB: {}
    }
  };

  return backup;
}

export function validateBackupFile(fileContent: string): BackupData | null {
  try {
    const data = JSON.parse(fileContent);
    if (
      data &&
      data.format === "lean-strong-tracker-backup" &&
      data.schemaVersion === 1 &&
      data.data &&
      typeof data.data.localStorage === "object"
    ) {
      return data as BackupData;
    }
  } catch (e) {
    // Parsing error
  }
  return null;
}

export async function restoreBackupData(backup: BackupData): Promise<void> {
  // Clear only app-owned keys that we track, but since user may have old keys, clear all "lean_strong_" keys first
  const keys = getAppLocalStorageKeys();
  for (const key of keys) {
    window.localStorage.removeItem(key);
  }

  // Restore keys from backup
  const lsData = backup.data.localStorage;
  if (lsData) {
    for (const [key, value] of Object.entries(lsData)) {
      if (key.startsWith("lean_strong_")) {
        window.localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
      }
    }
  }
}

export function exportBackup(backup: BackupData, filename: string): void {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  
  // Try Web Share API if available and if we're on a mobile device where it makes sense
  // Wait, Web Share API might not support sharing local blobs easily without File objects, let's use a standard download.
  // Actually on iOS PWA, standard download opens in Safari or Files.
  
  if (navigator.share && navigator.canShare) {
      const file = new File([blob], filename, { type: "application/json" });
      if (navigator.canShare({ files: [file] })) {
          navigator.share({
              files: [file],
              title: "Lean + Strong Backup",
              text: "My 12-week plan backup."
          }).catch(console.error);
          return;
      }
  }

  // Fallback to standard download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
