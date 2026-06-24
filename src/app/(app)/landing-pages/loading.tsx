export default function LandingPagesLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="space-y-2">
        <div className="h-9 w-52 bg-muted/60 rounded-xl animate-pulse" />
        <div className="h-5 w-96 bg-muted/40 rounded-lg animate-pulse" />
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/50 bg-card/50 overflow-hidden animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="h-32 bg-muted/40" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/4 bg-muted/60 rounded-lg" />
              <div className="h-3 w-full bg-muted/40 rounded" />
              <div className="h-3 w-2/3 bg-muted/40 rounded" />
              <div className="flex gap-2 pt-1">
                <div className="h-8 flex-1 bg-muted/40 rounded-lg" />
                <div className="h-8 w-8 bg-muted/30 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
