import { TrendingUp } from "lucide-react";

export default function AppGlobalLoading() {
  return (
    <div className="flex h-[calc(100vh-10rem)] w-full flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center gap-6">
        {/* Pulsing Logo */}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-2xl shadow-primary/40 animate-pulse">
          <TrendingUp className="h-12 w-12 animate-bounce" />
          
          {/* Subtle outer glow/ring */}
          <div className="absolute inset-0 rounded-3xl ring-4 ring-primary/30 animate-ping" style={{ animationDuration: '2s' }}></div>
        </div>
        
        {/* Text */}
        <div className="space-y-2 text-center">
          <h3 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
            ViralBook AI
          </h3>
          <p className="text-sm font-medium text-muted-foreground animate-pulse uppercase tracking-widest">
            Processando...
          </p>
        </div>
      </div>
    </div>
  );
}
