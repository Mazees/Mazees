import Navbar from "@/components/Navbar";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Brand Terminal Identifier */}
          <div className="flex items-center space-x-2 text-2xl sm:text-3xl font-extrabold tracking-widest text-textPrimary">
            <span className="font-mono text-primary">&lt;</span>
            <span>MAZEES</span>
            <span className="font-mono text-primary">/&gt;</span>
          </div>

          {/* Minimalist Spinner & Status */}
          <div className="flex items-center space-x-3 pt-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="font-mono text-xs text-textSecondary">
              Initializing workspace...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
