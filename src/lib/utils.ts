import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This should be replaced with a proper toast implementation
export function setToastState(arg0: { type: string; message: string }) {
  // This is a placeholder - replace with your actual toast implementation
  console.log(`Toast: ${arg0.type} - ${arg0.message}`);
}

export type ToastType = "loading" | "success" | "error" | null;

export type ToastState = {
  type: ToastType;
  message: string;
};

// URL generation functions
export const navigateWithQuery = (basePath: string, query: string) => {
  return `${basePath}${query}`;
};
