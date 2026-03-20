"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

type ToastVariant = "success" | "error";
interface Toast { id: number; message: string; variant: ToastVariant; }
interface ToastContextValue { addToast: (message: string, variant?: ToastVariant) => void; }

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });
export function useToast() { return useContext(ToastContext); }

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 10); return () => clearTimeout(t); }, []);
  const isSuccess = toast.variant === "success";
  return (
    <div
      role="alert"
      className={`
        pointer-events-auto flex items-start gap-3
        px-4 py-3 min-w-[260px] max-w-[340px]
        border shadow-md
        transition-all duration-300 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
        ${isSuccess
          ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
          : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"}
      `}
    >
      <span className="font-sans font-bold text-sm mt-px" aria-hidden>{isSuccess ? "✓" : "✕"}</span>
      <p className="font-sans text-sm flex-1 leading-snug">{toast.message}</p>
      <button onClick={onClose} aria-label="Dismiss" className="opacity-50 hover:opacity-100 transition-opacity text-lg leading-none ml-1">×</button>
    </div>
  );
}

let _nextId = 0;
const AUTO_DISMISS_MS = 4000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  function dismiss(id: number) {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  const addToast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = ++_nextId;
    setToasts((prev) => [...prev, { id, message, variant }]);
    const timer = setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    timers.current.set(id, timer);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div aria-live="polite" className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none sm:items-end items-center sm:right-5 right-0 sm:left-auto left-0">
        {toasts.map((t) => <ToastItem key={t.id} toast={t} onClose={() => dismiss(t.id)} />)}
      </div>
    </ToastContext.Provider>
  );
}
