import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, ShieldAlert, Info, X } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  showToast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;

const STYLES: Record<ToastVariant, { bg: string; icon: typeof CheckCircle2 }> = {
  success: { bg: "#22c55e", icon: CheckCircle2 },
  error: { bg: "#ef4444", icon: ShieldAlert },
  info: { bg: "#3b82f6", icon: Info },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[200] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6">
        {toasts.map((toast) => {
          const style = STYLES[toast.variant];
          const Icon = style.icon;
          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl px-4 py-3 text-white shadow-lg"
              style={{ background: style.bg, animation: "toast-in 0.2s ease-out" }}
            >
              <Icon size={20} className="shrink-0" />
              <span className="flex-1 text-sm font-medium">{toast.message}</span>
              <button
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss"
                className="shrink-0 opacity-80 hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes toast-in {
          from { transform: translateY(8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}