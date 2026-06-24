import { Loader2 } from "lucide-react";

export default function AppGlobalLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header skeleton */}
      <div className="flex justify-between items-start">
        <div className="space-y-3 flex-1">
          <div className="h-9 w-64 bg-muted/50 rounded-xl animate-pulse" />
          <div className="h-4 w-96 max-w-[80%] bg-muted/30 rounded-lg animate-pulse" />
        </div>
        <div className="h-9 w-28 bg-muted/40 rounded-lg animate-pulse shrink-0 hidden sm:block" />
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border border-border/40 bg-card/30 p-6 space-y-5 animate-pulse"
            style={{ animationDelay: `${i * 75}ms` }}
          >
            {/* Top row */}
            <div className="flex justify-between items-start">
              <div className="h-5 w-2/3 bg-muted/50 rounded-lg" />
              <div className="h-5 w-10 bg-muted/30 rounded-full" />
            </div>

            {/* Middle lines */}
            <div className="space-y-2.5">
              <div className="h-3.5 w-full bg-muted/30 rounded" />
              <div className="h-3.5 w-5/6 bg-muted/30 rounded" />
              <div className="h-3.5 w-4/6 bg-muted/30 rounded" />
            </div>

            {/* Badges row */}
            <div className="flex gap-2 pt-2">
              <div className="h-5 w-16 bg-muted/20 rounded-full" />
              <div className="h-5 w-14 bg-muted/20 rounded-full" />
            </div>

            {/* Footer row */}
            <div className="pt-4 border-t border-border/20 flex gap-2 justify-between items-center">
              <div className="h-9 w-24 bg-muted/40 rounded-xl" />
              <div className="h-9 w-9 bg-muted/20 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
