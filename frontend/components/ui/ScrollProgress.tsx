'use client';
import { useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (v) => setWidth(v * 100));
  }, [scrollYProgress]);

  return (
    <div
      className="scroll-progress"
      style={{ width: `${width}%`, transition: 'width 0.1s linear' }}
    />
  );
}
