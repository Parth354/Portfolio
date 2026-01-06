import React, { useState, useEffect, memo } from 'react';
import LoadingUI from './loader/LoadingUI';

const LoaderOverlay = memo(({ show = true, onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [fullyHidden, setFullyHidden] = useState(!show);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!show && !isExiting) {
      setIsExiting(true);
      setTimeout(() => {
        setFullyHidden(true);
        onComplete?.();
      }, 2000);
    }
  }, [show, isExiting, onComplete]);

  useEffect(() => {
    if (!show) return;
    const duration = 5000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min((elapsed / duration) * 100, 100);
      setProgress(p);
      if (p < 100) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [show]);

  if (fullyHidden) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000',
          zIndex: 9999,
          opacity: isExiting ? 0 : 1,
          visibility: fullyHidden ? 'hidden' : 'visible',
          transition: 'opacity 2s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Deep space nebula layers with richer colors and movement */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(circle at 30% 70%, #2a004a 0%, transparent 40%),
              radial-gradient(circle at 70% 30%, #4a0072 0%, transparent 45%),
              radial-gradient(circle at 50% 50%, #120030 0%, transparent 50%),
              #000000
            `,
            animation: 'slowPulse 15s ease-in-out infinite',
          }}
        />

        {/* Swirling accretion-inspired glows */}
        <div
          style={{
            position: 'absolute',
            inset: '-100%',
            background: 'radial-gradient(circle at center, rgba(255,140,0,0.12) 0%, rgba(255,200,100,0.08) 30%, transparent 60%)',
            animation: 'swirlGlow 30s linear infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '-100%',
            background: 'radial-gradient(circle at center, rgba(100,200,255,0.1) 0%, rgba(255,100,200,0.06) 35%, transparent 65%)',
            animation: 'swirlGlow 40s linear infinite reverse',
          }}
        />

        {/* Central subtle event horizon "pull" effect */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.7) 50%, #000000 70%)',
            animation: 'horizonBreathe 8s ease-in-out infinite',
          }}
        />

        {/* Enhanced twinkling stars with more variety */}
        {[...Array(120)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              background: Math.random() > 0.7 ? '#a0c4ff' : '#ffffff',
              borderRadius: '50%',
              boxShadow: Math.random() > 0.5 ? '0 0 8px #ffffff' : 'none',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.3,
              animation: `twinkle ${2 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          />
        ))}

        {/* Loading UI centered */}
        <LoadingUI progress={progress} isExiting={isExiting} />
      </div>

      {/* Inline keyframes for zero-load performance */}
      <style jsx global>{`
        @keyframes slowPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes swirlGlow {
          from { transform: rotate(0deg) translate(50px) rotate(0deg); }
          to { transform: rotate(360deg) translate(50px) rotate(-360deg); }
        }
        @keyframes horizonBreathe {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </>
  );
});

LoaderOverlay.displayName = 'LoaderOverlay';

export default LoaderOverlay;