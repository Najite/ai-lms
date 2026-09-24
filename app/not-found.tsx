import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#010102] text-[#f7f8f8] flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-lg border border-[#23252a] bg-[#08090a] p-6 text-center">
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#8a8f98]">
          404
        </div>
        <h2 className="mt-3 text-xl font-semibold text-[#f7f8f8]">
          This route is not available.
        </h2>
        <p className="mt-3 text-sm text-[#8a8f98]">
          The lesson or dashboard page you requested is unavailable or is not yet published.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex items-center justify-center rounded-md border border-[#5e6ad2]/40 bg-[#5e6ad2]/10 px-3 py-2 text-xs font-mono text-[#dfe4ff] transition-colors hover:bg-[#5e6ad2]/20"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
