"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.fatal("Critical Global Error in Root Layout", error, {
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-slate-100 font-sans">
        <div className="max-w-md rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-xl text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Critical System Failure</h2>
          <p className="text-sm text-slate-400 mb-6">
            A critical error occurred in the application root. Please reload or contact platform operations.
          </p>
          <button
            onClick={() => reset()}
            className="rounded bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200 transition-colors"
          >
            Restart Application
          </button>
        </div>
      </body>
    </html>
  );
}
