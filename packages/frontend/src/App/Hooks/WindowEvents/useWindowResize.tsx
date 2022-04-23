import { useState, useEffect } from 'react';

export interface WindowInnerSize {
  height: number;
  width: number;
}
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowInnerSize>({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
