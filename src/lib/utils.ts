import { clsx, type ClassValue } from "clsx";
import { NavigateFunction } from "react-router-dom";
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

export function updateCollectionIdParam(
  collection_id: string,
  searchParams: URLSearchParams,
  location: any,
  navigate: NavigateFunction
) {
  const newParams = new URLSearchParams(searchParams);
  newParams.set("collection_id", collection_id);
  navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
}
