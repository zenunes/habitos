import { Loader2 } from "lucide-react";

export function SystemLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="relative">
        <div className="absolute inset-0 bg-sky-500/20 blur-xl rounded-full animate-pulse" />
        <Loader2 size={40} className="text-sky-500 animate-spin relative z-10" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-sky-400 font-heading font-bold tracking-[0.2em] uppercase text-sm animate-pulse">
          Sincronizando Sistema
        </p>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-sky-500/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-sky-500/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-sky-500/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
