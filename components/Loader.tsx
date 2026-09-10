import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';

interface LoaderProps {
  currentUrl: string;
  onOpenExternal: () => void;
  onRetry: () => void;
}

export const Loader: React.FC<LoaderProps> = ({
  currentUrl,
  onOpenExternal,
  onRetry
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isTakingLong = secondsElapsed >= 6;

  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-sm w-full mx-4 bg-slate-900/95 backdrop-blur-md rounded-3xl border border-slate-800 shadow-2xl text-center animate-fadeIn">
      {/* Brand Icon */}
      <div className="relative mb-5">
        <div className="w-16 h-16 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-950/50">
          <LayoutDashboard className="w-8 h-8 text-teal-400 animate-pulse" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700">
          <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-ping" />
        </div>
      </div>

      {/* Title & Status */}
      <h1 className="text-xl font-bold text-slate-100 tracking-tight">
        Portal KOMIDA
      </h1>
      <p className="text-xs text-slate-400 mt-1 font-mono truncate max-w-xs px-2">
        Menghubungkan ke Portal...
      </p>

      {/* Animated dots */}
      <div className="flex items-center justify-center mt-3 space-x-1.5">
        <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>

      {/* Taking Longer than usual Helper / Fallback */}
      {isTakingLong && (
        <div className="mt-5 pt-4 border-t border-slate-800/80 w-full space-y-3 animate-fadeIn">
          <div className="flex items-start gap-2 text-left bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 text-xs text-slate-300">
            <AlertCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              Jika halaman membutuhkan waktu lebih lama atau dibatasi oleh server tujuan, Anda dapat membukanya langsung di browser.
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={onOpenExternal}
              className="w-full py-2 px-3 bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka di Tab Baru / Browser Luar</span>
            </button>

            <button
              onClick={onRetry}
              className="w-full py-1.5 px-3 text-slate-400 hover:text-slate-200 text-[11px] transition-colors flex items-center justify-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Coba Muat Ulang</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

