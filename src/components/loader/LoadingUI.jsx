import React, { useState, useEffect } from 'react';

export default function LoadingUI({ progress, isExiting }) {
  const [dots, setDots] = useState('');

  const loadingStages = [
    'Fueling the Engine',
    'Oh! Elon Musk stopping',
    'Elon busy fighting Trump',
    'Almost There...',
    'Welcome to the Cosmos',
  ];
  const currentStage = Math.min(
    Math.floor((progress / 100) * loadingStages.length),
    loadingStages.length
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const uiStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: '#fff',
    zIndex: 10,
    pointerEvents: 'none', // Prevent interaction
    opacity: isExiting ? 0 : 1,
    transition: 'opacity 1.5s ease-out',
    animation: 'float 3s ease-in-out infinite',
  };

  const textStyle = {
    fontSize: '1.6rem',
    fontWeight: 500,
    background: 'linear-gradient(90deg, #ffffffff, #e91e63)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 25px rgba(0, 0, 0, 1), 0 0 40px rgba(212, 54, 107, 0.5)',
    marginBottom: '1rem',
  };

  const dotsStyle = {
    display: 'inline-block',
    fontSize: '2rem',
    letterSpacing: '0.2em',
    color: 'rgba(255,255,255,0.8)',
    animation: 'dots 1.5s steps(4, end) infinite',
  };

  const dotStyle = index => ({
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    margin: '0 4px',
    background:
      progress > index * 20
        ? 'linear-gradient(135deg, #ffffffff, #e91e63)'
        : 'rgba(138, 43, 226, 0.2)',
    boxShadow:
      progress > index * 20
        ? '0 0 15px rgba(138, 43, 226, 0.8), 0 0 25px rgba(255, 255, 255, 0.5)'
        : 'none',
    transform: progress > index * 20 ? 'scale(1.4)' : 'scale(1)',
    transition: 'all 0.4s ease',
  });

  return (
    <div style={uiStyle}>
      <div style={textStyle}>
        {loadingStages[currentStage]}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={dotStyle(i)} />
        ))}
      </div>

      {/* Floating animation keyframes */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
            50% { transform: translate(-50%, -50%) translateY(-10px); }
          }
        `}
      </style>
    </div>
  );
}
