export default function LibraryLoading() {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-8 -m-8">
      <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
        {/* Header skeleton */}
        <div className="text-center space-y-4">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-muted/60 animate-pulse mx-auto" />
          <div className="h-10 w-72 bg-muted/60 rounded-xl animate-pulse mx-auto" />
          <div className="h-5 w-96 bg-muted/40 rounded-lg animate-pulse mx-auto" />
        </div>

        {/* Tabs skeleton */}
        <div className="space-y-6">
          <div className="flex gap-2 border-b border-border/50 pb-0">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 w-28 bg-muted/50 rounded-t-lg animate-pulse" />
            ))}
          </div>

          {/* Content grid skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border/50 bg-card/50 p-5 space-y-4 animate-pulse"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="h-5 w-3/4 bg-muted/60 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-muted/40 rounded" />
                  <div className="h-3 w-5/6 bg-muted/40 rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-muted/30 rounded-full" />
                  <div className="h-5 w-12 bg-muted/30 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
