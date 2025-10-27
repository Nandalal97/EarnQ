import { useEffect, useState, useRef } from 'react';

const INSTALL_KEY = 'pwa-install-ignored';

function PwaInstaller() {
  const [showButton, setShowButton] = useState(false);
  const deferredPromptRef = useRef(null);

  useEffect(() => {
    // Detect mobile devices only
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobile) return;

    // Already ignored? hide button
    if (localStorage.getItem(INSTALL_KEY)) return;

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setShowButton(true); // show custom install button
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    const deferredPrompt = deferredPromptRef.current;
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);

    if (outcome === 'accepted') {
      deferredPromptRef.current = null;
      setShowButton(false);
    } else if (outcome === 'dismissed') {
      // Optional: keep button visible or hide
      setShowButton(false);
    }
  };

  const handleIgnore = () => {
    localStorage.setItem(INSTALL_KEY, 'true'); // mark ignored
    setShowButton(false);
  };

  if (!showButton) return null;

  return (
    <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 1000 }}>
      <button
        onClick={handleInstall}
        style={{
          marginRight: 10,
          padding: '10px 20px',
          borderRadius: 8,
          background: '#0078ff',
          color: '#fff',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Install EarnQ
      </button>
      <button
        onClick={handleIgnore}
        style={{
          padding: '10px 20px',
          borderRadius: 8,
          background: '#ccc',
          color: '#333',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Ignore
      </button>
    </div>
  );
}

export default PwaInstaller;
