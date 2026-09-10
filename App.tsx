import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Loader } from './components/Loader';

const TARGET_URL = "https://script.google.com/macros/s/AKfycbzEnIp7_1GOANolVhNdFffzx1pJ461PJcs4Pz_PNylR-jIkg4e6Eqkzg6-ssDCnKAKw/exec";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleReload = useCallback(() => {
    setIsLoading(true);
    if (iframeRef.current) {
      try {
        iframeRef.current.src = TARGET_URL;
      } catch {
        // Cross-origin fallback
      }
    }
    setIframeKey(prev => prev + 1);
  }, []);

  const handleOpenExternal = useCallback(() => {
    window.open(TARGET_URL, '_blank', 'noopener,noreferrer');
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col relative select-none">
      {/* Loading Progress Bar at top */}
      {isLoading && (
        <div className="w-full h-1 bg-slate-800 overflow-hidden absolute top-0 left-0 right-0 z-40">
          <div className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 w-full animate-pulse transform origin-left" />
        </div>
      )}

      {/* Main Full-Screen Area */}
      <main className="flex-1 relative w-full h-full overflow-hidden bg-slate-900">
        {/* Loader Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm">
            <Loader
              currentUrl={TARGET_URL}
              onOpenExternal={handleOpenExternal}
              onRetry={handleReload}
            />
          </div>
        )}

        {/* Pure Clean Full-Screen Iframe */}
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={TARGET_URL}
          className={`w-full h-full border-0 transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleIframeLoad}
          title="Portal KOMIDA"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-downloads allow-storage-access-by-user-activation allow-presentation allow-orientation-lock"
          allow="accelerometer; ambient-light-sensor; autoplay; camera; clipboard-read; clipboard-write; display-capture; document-domain; encrypted-media; fullscreen; geolocation; gyroscope; layout-animations; magnetometer; microphone; midi; payment; picture-in-picture; screen-wake-lock; speaker-selection; sync-xhr; usb; web-share"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </main>
    </div>
  );
}
