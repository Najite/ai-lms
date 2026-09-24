export default function Loading() {
  return (
    <div className="min-h-screen bg-[#010102] text-[#f7f8f8] flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-lg border border-[#23252a] bg-[#08090a] p-6 text-center">
        <div className="mx-auto mb-4 h-2.5 w-2.5 rounded-full bg-[#5e6ad2] animate-pulse" />
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#8a8f98]">
          Loading curriculum
        </div>
        <div className="mt-3 text-sm text-[#d0d6e0]">
          Fetching the verified syllabus and preparing the workspace.
        </div>
      </div>
    </div>
  );
}
