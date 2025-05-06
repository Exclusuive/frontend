import { toast } from "sonner";
import { useRef, useState, useEffect } from "react";

export type ToastType = "loading" | "success" | "error" | null;

export type ToastState = {
  type: ToastType;
  message: string;
};

export function useToast() {
  const toastIdRef = useRef<any | null>(null);
  const [toastState, setToastState] = useState<ToastState>({ type: null, message: "" });

  useEffect(() => {
    if (!toastState.type || !toastState.message) return;

    if (toastState.type === "loading") {
      toastIdRef.current = toast.loading(toastState.message);
    } else if (toastState.type === "success" && toastIdRef.current !== null) {
      toast.success(toastState.message, { id: toastIdRef.current });
      toastIdRef.current = null;
    } else if (toastState.type === "error" && toastIdRef.current !== null) {
      toast.error(toastState.message, { id: toastIdRef.current });
      toastIdRef.current = null;
    }

    // Reset state
    setToastState({ type: null, message: "" });
  }, [toastState]);

  return { setToastState };
}
