import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ExternalLink, RefreshCw, Settings2 } from 'lucide-react';
import { Loader } from './components/Loader';
import {
  getFrameOffsetTop,
  resolveTargetUrl,
  wrapperConfig,
} from './config';

export default function App() {
  const targetUrl = useMemo(() => resolveTargetUrl(), []);
  const frameOffsetTop = useMemo(
    () => (targetUrl ? getFrameOffsetTop(targetUrl) : 0),
    [targetUrl],
  );
  const [isLoading, setIsLoading] = useState(Boolean(targetUrl));
  const [frameKey, setFrameKey] = useState(0);

  useEffect(() => {
    document.title = wrapperConfig.appTitle;
  }, []);

  const reloadFrame = useCallback(() => {
    if (!targetUrl) return;
    setIsLoading(true);
    setFrameKey((value) => value + 1);
  }, [targetUrl]);

  const openExternal = useCallback(() => {
    if (!targetUrl) return;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  }, [targetUrl]);

  if (!targetUrl) {
    return (
      <main className="setup-page">
        <section className="setup-card" aria-labelledby="setup-title">
          <div className="setup-icon" aria-hidden="true">
            <Settings2 size={28} />
          </div>
          <p className="eyebrow">INFRAME APP</p>
          <h1 id="setup-title">Target URL belum dikonfigurasi</h1>
          <p>
            Tambahkan <code>VITE_TARGET_URL</code> pada environment variable,
            lalu deploy ulang aplikasi.
          </p>
          <pre>VITE_TARGET_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec</pre>
          <p className="setup-note">
            Lihat README untuk konfigurasi Google Apps Script, Vercel, crop banner,
            forwarding parameter, dan mode URL override.
          </p>
        </section>
      </main>
    );
  }

  const frameStyle: React.CSSProperties = frameOffsetTop
    ? {
        height: `calc(100% + ${frameOffsetTop}px)`,
        transform: `translateY(-${frameOffsetTop}px)`,
      }
    : undefined;

  return (
    <div className="app-shell">
      {isLoading && <div className="top-progress" aria-hidden="true" />}

      <main className="frame-stage">
        {isLoading && (
          <Loader
            appTitle={wrapperConfig.appTitle}
            currentUrl={targetUrl}
            timeoutSeconds={wrapperConfig.loadingHelpAfterSeconds}
            onOpenExternal={openExternal}
            onRetry={reloadFrame}
          />
        )}

        <iframe
          key={frameKey}
          src={targetUrl}
          title={wrapperConfig.appTitle}
          className={`app-frame ${isLoading ? 'is-loading' : 'is-ready'}`}
          style={frameStyle}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
          sandbox={wrapperConfig.disableSandbox ? undefined : wrapperConfig.sandbox}
          allow={wrapperConfig.permissionsPolicy}
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />

        {!isLoading && wrapperConfig.showControls && (
          <div className="floating-controls" aria-label="Kontrol halaman">
            <button type="button" onClick={reloadFrame} title="Muat ulang">
              <RefreshCw size={16} />
            </button>
            <button type="button" onClick={openExternal} title="Buka URL asli">
              <ExternalLink size={16} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
