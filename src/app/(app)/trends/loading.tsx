export default function TrendsLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="space-y-2">
        <div className="h-9 w-48 bg-muted/60 rounded-xl animate-pulse" />
        <div className="h-5 w-72 bg-muted/40 rounded-lg animate-pulse" />
      </div>
      {/* Chart placeholder */}
      <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-4 animate-pulse">
        <div className="h-5 w-40 bg-muted/60 rounded-lg" />
        <div className="h-48 w-full bg-muted/30 rounded-xl" />
      </div>
      {/* List */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/50 bg-card/50 p-4 flex gap-4 items-center animate-pulse"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="h-8 w-8 bg-muted/50 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-muted/60 rounded" />
              <div className="h-3 w-32 bg-muted/40 rounded" />
            </div>
            <div className="h-6 w-16 bg-muted/40 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
