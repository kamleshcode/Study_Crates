import React from 'react';

const BubblesBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <div className="absolute w-full h-full">
      {[...Array(20)].map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full opacity-30 bg-blue-300 animate-bubble"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${20 + Math.random() * 60}px`,
            height: `${20 + Math.random() * 60}px`,
            bottom: `-${Math.random() * 100}px`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 8}s`,
          }}
        />
      ))}
    </div>
  </div>
);

export default BubblesBackground;