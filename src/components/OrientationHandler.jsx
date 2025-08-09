'use client';

import { useState, useEffect } from 'react';

export default function OrientationHandler({ children, preferredOrientation = 'both' }) {
  const [orientation, setOrientation] = useState('portrait');
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      setOrientation(isPortrait ? 'portrait' : 'landscape');
      setIsSmallScreen(window.innerHeight < 500);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (preferredOrientation === 'portrait' && orientation === 'landscape' && isSmallScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 text-white p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold mb-4">Rotate Your Device</h2>
          <p className="text-lg">This game works best in portrait mode.</p>
          <p className="text-sm mt-2 opacity-75">Please rotate your device to portrait orientation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`orientation-${orientation} ${isSmallScreen ? 'small-screen' : ''}`}>
      {children}
    </div>
  );
}
