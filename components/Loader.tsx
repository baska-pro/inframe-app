import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

interface LoaderProps {
  appTitle: string;
  currentUrl: string;
  timeoutSeconds: number;
  onOpenExternal: () => void;
  onRetry: () => void;
}

export const Loader: React.FC<LoaderProps> = ({
  appTitle,
  currentUrl,
  timeoutSeconds,
  onOpenExternal,
  onRetry,
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsElapsed((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hostname = useMemo(() => {
    try {
      return new URL(currentUrl).hostname;
    } catch {
      return 'server tujuan';
    }
  }, [currentUrl]);

  const isTakingLong = secondsElapsed >= timeoutSeconds;

  return (
    <div className="loader-overlay" role="status" aria-live="polite">
      <section className="loader-card">
        <div className="loader-mark" aria-hidden="true">
          <span />
        </div>
        <p className="eyebrow">INFRAME APP</p>
        <h1>{appTitle}</h1>
        <p className="loader-host">Menghubungkan ke {hostname}</p>
        <div className="loading-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        {isTakingLong && (
          <div className="loader-help">
            <div className="notice">
              <AlertCircle size={17} />
              <p>
                Halaman membutuhkan waktu lebih lama. Login Google, cookie pihak
                ketiga, atau kebijakan iframe dari server tujuan dapat membatasi
                pemuatan.
              </p>
            </div>
            <div className="loader-actions">
              <button type="button" className="primary-button" onClick={onOpenExternal}>
                <ExternalLink size={15} />
                Buka URL asli
              </button>
              <button type="button" className="secondary-button" onClick={onRetry}>
                <RefreshCw size={15} />
                Muat ulang
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
