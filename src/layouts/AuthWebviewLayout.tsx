import React from "react";

export function AuthWebViewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center bg-gray-200 min-h-screen w-full">
      <div className="flex flex-col w-full max-w-[428px] min-w-[320px] bg-white min-h-screen shadow-lg relative">
        {children}
      </div>
    </div>
  );
}
