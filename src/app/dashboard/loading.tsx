export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Top Header Placeholder */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-surface rounded-xl border border-border" />
          <div className="h-4 w-72 bg-surface/60 rounded-lg border border-border/40" />
        </div>
        <div className="h-10 w-36 bg-surface rounded-xl border border-border" />
      </div>

      {/* Metrics / Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-6 bg-surface/80 border border-border rounded-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-background rounded-md border border-border/60" />
              <div className="h-8 w-8 bg-background rounded-xl border border-border/60" />
            </div>
            <div className="h-8 w-16 bg-background rounded-xl border border-border/60" />
            <div className="h-3 w-32 bg-background/60 rounded-md" />
          </div>
        ))}
      </div>

      {/* Main Content / Table Area Skeleton */}
      <div className="p-6 bg-surface/80 border border-border rounded-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="h-5 w-40 bg-background rounded-lg border border-border/60" />
          <div className="h-8 w-24 bg-background rounded-lg border border-border/60" />
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-background/50 border border-border/40 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-surface rounded-lg border border-border/60" />
                <div className="space-y-1.5">
                  <div className="h-4 w-44 bg-surface rounded-md" />
                  <div className="h-3 w-28 bg-surface/60 rounded-md" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-16 bg-surface rounded-lg border border-border/60" />
                <div className="h-8 w-8 bg-surface rounded-lg border border-border/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
