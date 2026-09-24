"use client";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#010102] text-[#f7f8f8] flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-lg border border-[#23252a] bg-[#08090a] p-6 text-center">
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#f59e0b]">
          Runtime error
        </div>
        <h2 className="mt-3 text-xl font-semibold text-[#f7f8f8]">
          The workspace could not load cleanly.
        </h2>
        <p className="mt-3 text-sm text-[#8a8f98]">
          This can happen during a flaky connection or a failed lesson load. Retry to recover the UI.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-5 inline-flex items-center justify-center rounded-md border border-[#5e6ad2]/40 bg-[#5e6ad2]/10 px-3 py-2 text-xs font-mono text-[#dfe4ff] transition-colors hover:bg-[#5e6ad2]/20"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
