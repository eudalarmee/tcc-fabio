import { useState, useEffect } from 'react';

export function useParallaxMouse(intensity = 1) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalizar posição do mouse (-1 a 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      setMousePosition({
        x: x * intensity,
        y: y * intensity
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [intensity]);

  return mousePosition;
}
