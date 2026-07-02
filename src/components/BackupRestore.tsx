import React, { useState, useRef } from "react";
import { Download, Upload, FileJson, AlertTriangle } from "lucide-react";
import { collectBackupData, exportBackup, validateBackupFile, restoreBackupData, BackupData } from "../utils/backupUtils";
import { getLocalTodayString } from "../utils/dateUtils";

export default function BackupRestore() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<BackupData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      const backup = await collectBackupData();
      const filename = `lean-strong-backup-${getLocalTodayString()}.json`;
      exportBackup(backup, filename);
      setSuccessMsg("Backup created successfully.");
      setTimeout(() => setSuccessMsg(null), 3000);
      setErrorMsg(null);
    } catch (e) {
      setErrorMsg("Failed to export backup.");
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const backup = validateBackupFile(content);
      if (backup) {
        setPreviewData(backup);
      } else {
        setErrorMsg("This file is not a valid Lean + Strong backup.");
      }
    };
    reader.onerror = () => {
      setErrorMsg("Failed to read file.");
    };
    reader.readAsText(file);
    e.target.value = ""; // Reset input
  };

  const handleRestore = async () => {
    if (!previewData) return;
    try {
      await restoreBackupData(previewData);
      setSuccessMsg("Backup restored successfully");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      setErrorMsg("Failed to restore backup.");
    }
  };

  const cancelRestore = () => {
    setPreviewData(null);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
      <h4 className="text-xs font-mono font-bold uppercase text-white flex items-center gap-1.5 mb-2 tracking-wider">
        <FileJson className="w-4 h-4" />
        Data & Backup
      </h4>
      <p className="text-[10px] text-zinc-400 leading-relaxed mb-4">
        Export a copy of your workout, progress, nutrition, and app settings. Uploaded PDF files are not included. Backup files may contain personal health and workout information. Store them somewhere private.
      </p>

      {previewData ? (
        <div className="bg-zinc-900 border border-white/20 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2 text-amber-500">
            <AlertTriangle className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">Confirm Restore</h5>
          </div>
          <p className="text-[10px] text-zinc-300 mb-3">
            Restoring this backup will replace the app data currently stored on this device. Uploaded PDF files are not included.
          </p>
          <div className="text-[9px] font-mono text-zinc-500 mb-4 space-y-1">
            <div>Backup Date: {new Date(previewData.exportedAt).toLocaleDateString()}</div>
            <div>Schema Version: {previewData.schemaVersion}</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={cancelRestore}
              className="flex-1 bg-zinc-800 text-white text-xs font-bold py-2.5 rounded-lg hover:bg-zinc-700 transition-colors uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              onClick={handleRestore}
              className="flex-1 bg-white text-black text-xs font-bold py-2.5 rounded-lg hover:bg-zinc-200 transition-colors uppercase tracking-wider"
            >
              Restore Data
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex-1 bg-white/10 text-white border border-white/10 hover:bg-white/20 text-xs font-bold py-3 rounded-xl transition-all flex flex-col items-center justify-center gap-1.5 uppercase tracking-wider"
          >
            <Download className="w-4 h-4" />
            Export Backup
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-white/10 text-white border border-white/10 hover:bg-white/20 text-xs font-bold py-3 rounded-xl transition-all flex flex-col items-center justify-center gap-1.5 uppercase tracking-wider"
          >
            <Upload className="w-4 h-4" />
            Restore Backup
          </button>
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileSelect}
          />
        </div>
      )}

      {errorMsg && (
        <div className="mt-4 text-[10px] font-mono text-red-400 bg-red-950/30 p-2 rounded border border-red-900/50">
          {errorMsg}
        </div>
      )}
      
      {successMsg && (
        <div className="mt-4 text-[10px] font-mono text-emerald-400 bg-emerald-950/30 p-2 rounded border border-emerald-900/50">
          {successMsg}
        </div>
      )}
    </div>
  );
}
