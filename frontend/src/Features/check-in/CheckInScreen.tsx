import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Copy,
  ScanLine,
  Camera,
  AlertCircle,
  Loader2,
  QrCode,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Html5Qrcode } from "html5-qrcode";
import { checkInApi, type ScanResult } from "../../lib/checkInApi";
import { eventsApi } from "../../lib/eventsApi";
import type { Event } from "../../api/interfaces/events";

interface CheckInScreenProps {
  eventId?: string;
  onBack?: () => void;
}

const CheckInScreen: React.FC<CheckInScreenProps> = ({ eventId, onBack }) => {
  const [activeTab, setActiveTab] = useState<"scan" | "generator">("scan");
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(false);

  // Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [manualPassId, setManualPassId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  // QR Display/Generator state
  const [passIdToDisplay, setPassIdToDisplay] = useState("");
  const [copied, setCopied] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "qr-reader-container";

  // Load event details if eventId provided, or load first upcoming event
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoadingEvent(true);
        if (eventId) {
          const ev = await eventsApi.get(eventId);
          setCurrentEvent(ev);
        } else {
          const events = await eventsApi.list();
          if (events.length > 0) {
            setCurrentEvent(events[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load event details for check-in:", err);
      } finally {
        setLoadingEvent(false);
      }
    };
    void fetchEvent();
  }, [eventId]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        void scannerRef.current.stop();
      }
    };
  }, []);

  // Parse pass ID from raw QR text (raw UUID, URL, or JSON)
  const extractPassId = (rawText: string): string => {
    const trimmed = rawText.trim();

    // Check if JSON payload
    try {
      const parsed = JSON.parse(trimmed) as { passId?: string; id?: string };
      if (parsed.passId) return parsed.passId;
      if (parsed.id) return parsed.id;
    } catch {
      /* not JSON */
    }

    // Check if URL with pass ID path or query param
    if (trimmed.includes("/")) {
      const parts = trimmed.split("/");
      const lastPart = parts[parts.length - 1].split("?")[0];
      if (lastPart && lastPart.length > 10) {
        return lastPart;
      }
    }

    return trimmed;
  };

  const processPassCheckIn = async (rawPassId: string) => {
    const passId = extractPassId(rawPassId);
    if (!passId) return;

    // Stop scanner while processing
    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }

    setIsSubmitting(true);
    setScanResult(null);
    setScanError(null);

    try {
      const result = await checkInApi.scanPass(passId);
      setScanResult(result);
    } catch (err: any) {
      console.error("Check-in scan error:", err);
      setScanError(err?.message || "Check-in failed. Invalid or expired pass.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startCameraScanner = async () => {
    setScanResult(null);
    setScanError(null);

    try {
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop();
      }

      const html5Qrcode = new Html5Qrcode(scannerContainerId);
      scannerRef.current = html5Qrcode;

      setIsScanning(true);

      await html5Qrcode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          void processPassCheckIn(decodedText);
        },
        () => {
          /* ignore frame scan errors */
        }
      );
    } catch (err) {
      console.error("Camera access error:", err);
      setIsScanning(false);
      setScanError("Could not access camera. Please check camera permissions or type pass ID manually.");
    }
  };

  const stopCameraScanner = async () => {
    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    setIsScanning(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualPassId.trim()) {
      void processPassCheckIn(manualPassId.trim());
      setManualPassId("");
    }
  };

  const handleCopyPassId = async () => {
    if (!passIdToDisplay) return;
    try {
      await navigator.clipboard.writeText(passIdToDisplay);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy pass ID:", err);
    }
  };

  return (
    <div className="bg-dot-grid min-h-screen text-[var(--text-primary)] font-sans">
      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-5xl mx-auto">
          {/* TOP BAR */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="
                inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                font-medium text-[var(--text-secondary)] hover:text-emerald-500
                hover:bg-emerald-500/10 transition-colors cursor-pointer
              "
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>

            {/* TAB SELECTOR */}
            <div className="flex items-center gap-1 bg-[var(--bg-input)] p-1 rounded-xl border border-[var(--border-default)]">
              <button
                type="button"
                onClick={() => {
                  void stopCameraScanner();
                  setActiveTab("scan");
                }}
                className={`
                  flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer
                  ${
                    activeTab === "scan"
                      ? "bg-emerald-500 text-emerald-950 shadow-sm"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }
                `}
              >
                <ScanLine className="w-4 h-4" />
                Scan Pass
              </button>

              <button
                type="button"
                onClick={() => {
                  void stopCameraScanner();
                  setActiveTab("generator");
                }}
                className={`
                  flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer
                  ${
                    activeTab === "generator"
                      ? "bg-emerald-500 text-emerald-950 shadow-sm"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }
                `}
              >
                <QrCode className="w-4 h-4" />
                Pass Display
              </button>
            </div>
          </div>

          {/* HEADER */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <ScanLine className="w-5 h-5 text-emerald-500" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                  {activeTab === "scan" ? "Door Check-In Scanner" : "Attendee Pass Display"}
                </h1>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {activeTab === "scan"
                    ? "Scan attendee QR codes to grant entry and record check-ins in real time."
                    : "Generate or view a QR code pass for event entry."}
                </p>
              </div>
            </div>
          </div>

          {/* EVENT BANNER */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500 mb-1">
                  Active Event
                </p>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  {loadingEvent ? "Loading event..." : currentEvent?.title || "Tech Innovators Summit 2026"}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {currentEvent ? `${currentEvent.date} · ${currentEvent.location}` : "Aug 24, 2026 · Main Venue"}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Check-In System Live
              </div>
            </div>
          </div>

          {/* TAB 1: SCANNER */}
          {activeTab === "scan" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CAMERA SCANNER CARD */}
              <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6">
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-500" /> Camera Scanner
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mb-6">
                  Point the camera at an attendee's QR pass to scan and record check-in instantly.
                </p>

                {/* CAMERA VIEW BOX */}
                <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-[var(--border-default)] min-h-[300px] flex items-center justify-center">
                  <div
                    id={scannerContainerId}
                    className="w-full h-full min-h-[300px]"
                  />

                  {!isScanning && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[var(--bg-input)]/90 backdrop-blur-sm z-10">
                      <ScanLine className="w-12 h-12 text-emerald-500 mb-4 opacity-80" />
                      <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                        Camera Scanner Standby
                      </p>
                      <button
                        type="button"
                        onClick={() => void startCameraScanner()}
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4" /> Start Camera
                      </button>
                    </div>
                  )}

                  {isScanning && (
                    <button
                      type="button"
                      onClick={() => void stopCameraScanner()}
                      className="absolute top-4 right-4 z-20 px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white text-xs font-semibold rounded-lg backdrop-blur-md cursor-pointer transition-colors"
                    >
                      Stop Camera
                    </button>
                  )}
                </div>

                {/* MANUAL PASS ID FALLBACK */}
                <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                    Or Enter Pass ID Manually
                  </p>
                  <form onSubmit={handleManualSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste or type Pass UUID..."
                      value={manualPassId}
                      onChange={(e) => setManualPassId(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-[var(--bg-input)] border border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-emerald-500 font-mono text-xs"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || !manualPassId.trim()}
                      className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl transition-all disabled:opacity-60 cursor-pointer flex items-center gap-1.5"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check In"}
                    </button>
                  </form>
                </div>
              </div>

              {/* SCAN RESULT FEEDBACK CARD */}
              <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-emerald-500" /> Check-In Verification
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] mb-6">
                    Scan status and verified attendee information will appear here.
                  </p>

                  {/* LOADING FEEDBACK */}
                  {isSubmitting && (
                    <div className="py-16 text-center flex flex-col items-center justify-center">
                      <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-3" />
                      <p className="text-sm font-semibold text-[var(--text-primary)]">Verifying Pass…</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Checking backend database records</p>
                    </div>
                  )}

                  {/* SUCCESS FEEDBACK */}
                  {!isSubmitting && scanResult && (
                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl animate-fade-in">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-emerald-950 flex items-center justify-center font-bold">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                            Check-In Granted
                          </span>
                          <h3 className="text-xl font-extrabold text-[var(--text-primary)]">
                            {scanResult.checkIn.attendee.name}
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-2.5 pt-3 border-t border-emerald-500/20 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">Email:</span>
                          <span className="font-semibold text-[var(--text-primary)]">{scanResult.checkIn.attendee.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">Pass Type:</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                            {scanResult.checkIn.attendee.passType}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">Event:</span>
                          <span className="font-semibold text-[var(--text-primary)]">{scanResult.checkIn.event.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">Scanned Time:</span>
                          <span className="font-mono text-[var(--text-primary)]">
                            {new Date(scanResult.checkIn.scannedAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ERROR FEEDBACK */}
                  {!isSubmitting && scanError && (
                    <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl animate-fade-in">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-bold">
                          <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                            Check-In Denied
                          </span>
                          <h3 className="text-base font-bold text-red-400">
                            Invalid or Used Pass
                          </h3>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--text-primary)] mt-2 font-medium">
                        {scanError}
                      </p>
                    </div>
                  )}

                  {/* STANDBY FEEDBACK */}
                  {!isSubmitting && !scanResult && !scanError && (
                    <div className="py-16 text-center text-[var(--text-muted)]">
                      <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-medium">Ready to Scan</p>
                      <p className="text-xs mt-1">Start camera or type a pass code to verify entry.</p>
                    </div>
                  )}
                </div>

                {(scanResult || scanError) && (
                  <button
                    type="button"
                    onClick={() => {
                      setScanResult(null);
                      setScanError(null);
                      void startCameraScanner();
                    }}
                    className="w-full mt-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
                  >
                    <RefreshCw className="w-4 h-4" /> Scan Next Attendee
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PASS GENERATOR / DISPLAY */}
          {activeTab === "generator" && (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="text-center mb-7">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  Pass QR Code Display
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Enter an attendee's Pass UUID to render their scannable QR code.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  Pass UUID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
                  value={passIdToDisplay}
                  onChange={(e) => setPassIdToDisplay(e.target.value.trim())}
                  className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-default)] rounded-xl text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                />
              </div>

              {passIdToDisplay ? (
                <div className="flex flex-col items-center">
                  <div className="p-6 bg-white rounded-2xl border border-[var(--border-subtle)] shadow-md mb-6">
                    <QRCodeSVG
                      value={passIdToDisplay}
                      size={280}
                      level="H"
                      includeMargin
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyPassId}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-input)] hover:bg-emerald-500/10 border border-[var(--border-default)] text-[var(--text-primary)] text-sm font-medium transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> Pass ID Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-emerald-500" /> Copy Pass ID
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="py-12 text-center text-[var(--text-muted)] border border-dashed border-[var(--border-default)] rounded-2xl">
                  <QrCode className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-medium">Type a Pass UUID above to generate the QR Code</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInScreen;