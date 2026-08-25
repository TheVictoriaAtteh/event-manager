import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Copy,
  RefreshCw,
  ScanLine,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface CheckInScreenProps {
  onBack?: () => void;
}

const CheckInScreen: React.FC<CheckInScreenProps> = ({ onBack }) => {
  const [copied, setCopied] = useState(false);
  const [qrVersion, setQrVersion] = useState(1);

  /*
   * This is currently a mock URL.
   *
   * Later, your backend should generate a real
   * event-specific check-in URL/token.
   */
  const checkInUrl = useMemo(() => {
    return `https://event-manager.app/check-in/tech-summit-2026?v=${qrVersion}`;
  }, [qrVersion]);

  const regenerateQRCode = () => {
    setQrVersion((previous) => previous + 1);
    setCopied(false);
  };

  const copyCheckInLink = async () => {
    try {
      await navigator.clipboard.writeText(checkInUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy check-in link:", error);
    }
  };

  return (
    <div className="bg-dot-grid min-h-screen text-[var(--text-primary)]">
      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-5xl mx-auto">

          {/* ==================== TOP BAR ==================== */}
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className="
                inline-flex
                items-center
                gap-2
                px-3
                py-2
                rounded-lg
                text-sm
                font-medium
                text-[var(--text-secondary)]
                hover:text-emerald-500
                hover:bg-emerald-500/10
                transition-colors
                cursor-pointer
              "
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>

          {/* ==================== HEADER ==================== */}
          <div className="mb-8">
            <div className="flex items-center gap-3">

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-emerald-500/10
                  border
                  border-emerald-500/20
                  flex
                  items-center
                  justify-center
                "
              >
                <ScanLine className="w-5 h-5 text-emerald-500" />
              </div>

              <div>
                <h1
                  className="
                    text-2xl
                    font-bold
                    text-[var(--text-primary)]
                  "
                >
                  Event Check-In
                </h1>

                <p
                  className="
                    text-sm
                    text-[var(--text-secondary)]
                    mt-1
                  "
                >
                  Generate a QR code for attendees to scan and check in.
                </p>
              </div>

            </div>
          </div>

          {/* ==================== EVENT INFORMATION ==================== */}
          <div
            className="
              bg-[var(--bg-surface)]
              border
              border-[var(--border-subtle)]
              rounded-2xl
              p-6
              mb-6
            "
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div>
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-emerald-500
                    mb-2
                  "
                >
                  Current Event
                </p>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-[var(--text-primary)]
                  "
                >
                  Tech Innovators Summit 2026
                </h2>

                <p
                  className="
                    text-sm
                    text-[var(--text-secondary)]
                    mt-1
                  "
                >
                  Aug 24, 2026 · 09:00 AM - 05:00 PM
                </p>
              </div>

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  self-start
                  md:self-center
                  px-3
                  py-1.5
                  rounded-full
                  bg-emerald-500/10
                  border
                  border-emerald-500/20
                  text-emerald-500
                  text-xs
                  font-semibold
                "
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Check-In Active
              </div>

            </div>
          </div>

          {/* ==================== QR CODE SECTION ==================== */}
          <div
            className="
              bg-[var(--bg-surface)]
              border
              border-[var(--border-subtle)]
              rounded-2xl
              p-8
            "
          >

            {/* TITLE */}
            <div className="text-center mb-7">
              <h2
                className="
                  text-lg
                  font-bold
                  text-[var(--text-primary)]
                "
              >
                Check-In QR Code
              </h2>

              <p
                className="
                  text-sm
                  text-[var(--text-secondary)]
                  mt-1
                "
              >
                Attendees can scan this code using their phone camera
                to check in to the event.
              </p>
            </div>

            {/* ==================== LARGE QR CODE ==================== */}
            <div className="flex justify-center">
              <div
                className="
                  p-8
                  bg-white
                  rounded-2xl
                  border
                  border-[var(--border-subtle)]
                  shadow-sm
                "
              >
                <QRCodeSVG
                  value={checkInUrl}
                  size={360}
                  level="H"
                  includeMargin
                />
              </div>
            </div>

            {/* ==================== INSTRUCTIONS ==================== */}
            <div
              className="
                max-w-2xl
                mx-auto
                mt-7
                p-4
                rounded-xl
                bg-emerald-500/5
                border
                border-emerald-500/15
              "
            >
              <div className="flex items-start gap-3">

                <div
                  className="
                    w-8
                    h-8
                    rounded-lg
                    bg-emerald-500/10
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  <ScanLine className="w-4 h-4 text-emerald-500" />
                </div>

                <div>
                  <p
                    className="
                      text-xs
                      font-semibold
                      text-[var(--text-primary)]
                    "
                  >
                    How attendees check in
                  </p>

                  <p
                    className="
                      text-xs
                      text-[var(--text-secondary)]
                      mt-1
                      leading-relaxed
                    "
                  >
                    Display this QR code at the event entrance.
                    Entry to the venue will be granted upon successful scanning of your code.
                  </p>
                </div>

              </div>
            </div>

            {/* ==================== ACTIONS ==================== */}
            <div
              className="
                max-w-2xl
                mx-auto
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-3
                mt-5
              "
            >

              <button
                onClick={regenerateQRCode}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-lg
                  bg-emerald-600
                  hover:bg-emerald-500
                  text-white
                  text-sm
                  font-semibold
                  transition-colors
                  cursor-pointer
                "
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate QR Code
              </button>

              <button
                onClick={copyCheckInLink}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-lg
                  bg-[var(--bg-input)]
                  hover:bg-emerald-500/10
                  border
                  border-[var(--border-default)]
                  text-[var(--text-primary)]
                  text-sm
                  font-medium
                  transition-colors
                  cursor-pointer
                "
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Link Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-emerald-500" />
                    Copy Check-In Link
                  </>
                )}
              </button>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckInScreen;