"use client";

import { Toaster as Sonner } from "sonner";

// Toast messages for the whole app (same idea as React Toastify, video 29-8)
function Toaster(props) {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      }}
      {...props}
    />
  );
}

export { Toaster };
