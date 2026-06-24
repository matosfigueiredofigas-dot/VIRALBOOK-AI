export default function NichesLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="h-10 w-64 bg-muted/60 rounded-xl animate-pulse mx-auto" />
        <div className="h-5 w-80 bg-muted/40 rounded-lg animate-pulse mx-auto" />
      </div>
      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <div className="h-10 w-40 bg-muted/50 rounded-xl animate-pulse" />
        <div className="h-10 w-40 bg-muted/50 rounded-xl animate-pulse" />
        <div className="h-10 w-32 bg-muted/40 rounded-xl animate-pulse" />
      </div>
      {/* Idea card */}
      <div className="rounded-2xl border border-border/50 bg-card/50 p-8 space-y-4 animate-pulse mx-auto max-w-lg">
        <div className="h-6 w-48 bg-muted/60 rounded-lg mx-auto" />
        <div className="h-10 w-64 bg-muted/50 rounded-xl mx-auto" />
        <div className="h-10 w-36 bg-primary/20 rounded-xl mx-auto" />
      </div>
      {/* Suggestions grid */}
      <div className="grid gap-3 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/50 bg-card/50 p-4 space-y-2 animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="h-4 w-3/4 bg-muted/60 rounded" />
            <div className="h-3 w-1/2 bg-muted/40 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
