import React, { useEffect, useState } from 'react';

const GlowingCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hue, setHue] = useState(0);
  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    const colorInterval = setInterval(() => {
        setHue((prev) => (prev + 1) % 360);  // Cycle 0 to 360 (full color wheel)
      }, 200); // Speed of color change
  
    window.addEventListener('mousemove', moveCursor);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '1px',
        height: '1px',
        backgroundColor: `hsl(${hue}, 100%, 70%)`,
        borderRadius: '50%',
        border:"none",
        pointerEvents: 'none',
        transform: `translate(${position.x - 12}px, ${position.y - 12}px)`,
        transition: 'transform 0.05s ease',
        boxShadow: `
          0 0 30px 15px hsl(${hue}, 100%, 70%),
          0 0 60px 30px hsl(${hue}, 100%, 70%)
        `,
        mixBlendMode: 'lighten',
        zIndex: 9999,
        opacity: 0.2,
      }}
    ></div>
  );
};

export default GlowingCursor;
