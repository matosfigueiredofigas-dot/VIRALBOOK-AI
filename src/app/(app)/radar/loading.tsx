export default function GenericLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="space-y-3">
        <div className="h-9 w-56 bg-muted/60 rounded-xl animate-pulse" />
        <div className="h-5 w-80 bg-muted/40 rounded-lg animate-pulse" />
      </div>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/50 bg-card/50 p-5 space-y-3 animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="h-5 w-1/2 bg-muted/60 rounded-lg" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-muted/40 rounded" />
              <div className="h-3 w-4/5 bg-muted/40 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
