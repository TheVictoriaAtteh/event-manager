import type { ReactNode } from "react";

interface RouteModalProps {
  children: ReactNode;
  onClose: () => void;
  label: string;
}

/**
 * URL-backed modal shell. The URL remains shareable, while the parent screen
 * stays visible behind the overlay and the close action returns to its route.
 */
export function RouteModal({ children, onClose, label }: RouteModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="mx-auto min-h-full w-full max-w-5xl py-4">
        {children}
      </div>
    </div>
  );
}
