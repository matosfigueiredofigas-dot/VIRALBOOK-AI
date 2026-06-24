export default function FavoritesLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="space-y-2">
        <div className="h-9 w-48 bg-muted/60 rounded-xl animate-pulse" />
        <div className="h-5 w-80 bg-muted/40 rounded-lg animate-pulse" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/50 bg-card/50 p-5 space-y-4 animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex justify-between items-start">
              <div className="h-5 w-3/4 bg-muted/60 rounded-lg" />
              <div className="h-6 w-12 bg-muted/40 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-muted/40 rounded" />
              <div className="h-3 w-5/6 bg-muted/40 rounded" />
            </div>
            <div className="pt-2 border-t border-border/30 flex gap-2">
              <div className="h-9 flex-1 bg-muted/40 rounded-lg" />
              <div className="h-9 w-10 bg-muted/30 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
