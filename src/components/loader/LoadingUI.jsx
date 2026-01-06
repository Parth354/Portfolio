import React, { useState, useEffect, memo } from 'react';

// Extremely lightweight, instant-loading version
const LoadingUI = memo(({ progress = 0, isExiting = false }) => {
  const [dots, setDots] = useState('');

  // Clean, thematic messages (no memes)
  const stages = [
    'Igniting Core',
    'Charging Systems',
    'Aligning Orbit',
    'Entering Void',
    'Cosmos Ready',
  ];

  const stage = Math.min(Math.floor((progress / 100) * stages.length), stages.length - 1);

  useEffect(() => {
    const id = setInterval(() => {
      setDots(d => d.length < 3 ? d + '.' : '');
    }, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Full-screen overlay - renders instantly */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: isExiting ? 0 : 1,
          transition: 'opacity 1.2s ease-out',
        }}
      >
        {/* Main text - gradient for cosmic feel */}
        <div
          style={{
            fontSize: '2rem',
            fontWeight: '600',
            background: 'linear-gradient(90deg, #ffffff, #a0c4ff, #ffb1ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.08em',
            marginBottom: '1.5rem',
          }}
        >
          {stages[stage]}
          <span style={{ opacity: 0.8 }}>{dots}</span>
        </div>

        {/* Simple glowing dots - minimal but effective */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: progress >= (i + 1) * 20
                  ? 'linear-gradient(135deg, #a0c4ff, #ff6bcb)'
                  : 'rgba(255,255,255,0.1)',
                boxShadow: progress >= (i + 1) * 20
                  ? '0 0 16px rgba(160, 196, 255, 0.8)'
                  : 'none',
                transform: `scale(${progress >= (i + 1) * 20 ? 1.2 : 0.8})`,
                transition: 'all 0.5s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Tiny inline keyframes - no external CSS needed */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
});

LoadingUI.displayName = 'LoadingUI';

export default LoadingUI;