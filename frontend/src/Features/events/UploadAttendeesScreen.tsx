import React, { useRef, useState } from "react";
import { ArrowLeft, Upload, CheckCircle2, AlertTriangle, Loader2, FileText } from "lucide-react";
import { attendeesApi, type CsvImportResult } from "../../lib/attendeesApi";
import { ApiError } from "../../lib/apiClient";

interface UploadAttendeesScreenProps {
  eventId: string;
  onBack: () => void;
  onDone: () => void;
}

export const UploadAttendeesScreen: React.FC<UploadAttendeesScreenProps> = ({
  eventId,
  onBack,
  onDone,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CsvImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setError("");
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setError("");
    setLoading(true);
    try {
      const res = await attendeesApi.importCsv(eventId, file);
      setResult(res);
      if (res.created > 0) {
        setTimeout(() => onDone(), 1500);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not upload CSV.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dot-grid min-h-screen text-[var(--text-primary)] font-sans p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Attendees
        </button>

        <h1 className="text-2xl font-bold text-[var(--text-heading)] mb-1">Upload Attendees</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Import a CSV with columns <span className="font-medium text-[var(--text-primary)]">Name, Email, Pass Type</span>. Rows with errors are skipped and reported — a bad row never fails the whole file.
        </p>

        {error && <div className="mb-4 p-4 rounded-lg text-sm text-red-500 bg-red-500/10 border border-red-500/20">{error}</div>}

        <div className="space-y-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6">
          <label className="block border-2 border-dashed border-[var(--border-default)] hover:border-emerald-500/50 rounded-2xl p-8 text-center bg-[var(--bg-input)] transition-colors cursor-pointer">
            <input ref={inputRef} type="file" accept=".csv,text/csv" onChange={handleFileChange} className="hidden" />
            <FileText className="w-8 h-8 mx-auto text-[var(--text-muted)] mb-2" />
            <p className="text-xs font-medium text-[var(--text-primary)]">
              {file ? file.name : "Click to choose a CSV file"}
            </p>
            {file && <p className="text-[10px] text-[var(--text-muted)] mt-1">{(file.size / 1024).toFixed(1)} KB</p>}
          </label>

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={onBack} className="px-4 py-2.5 bg-[var(--bg-input)] hover:bg-[var(--hover-surface)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg text-xs font-medium transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="button" onClick={() => void handleUpload()} disabled={!file || loading} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50 shadow-lg shadow-emerald-900/10">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {loading ? "Uploading…" : "Upload and Import"}
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              {result.message}
            </div>
            {result.errors.length > 0 && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-500 mb-2">
                  <AlertTriangle className="w-4 h-4" /> Skipped rows
                </div>
                <ul className="space-y-1 max-h-48 overflow-y-auto">
                  {result.errors.map((err, i) => (
                    <li key={i} className="text-xs text-[var(--text-secondary)]">
                      {err.rowNumber > 0 ? `Row ${err.rowNumber}: ` : ""}{err.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadAttendeesScreen;