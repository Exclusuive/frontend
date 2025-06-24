import React from "react";
import Sidebar from "@/components/Sidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col sm:flex-row">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
