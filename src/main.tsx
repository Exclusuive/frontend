import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/sonner";
import "@mysten/dapp-kit/dist/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster expand={true} richColors />
  </StrictMode>
);
