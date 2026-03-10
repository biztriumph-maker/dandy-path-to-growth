import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useCallback } from 'react';

interface SceneWrapperProps {
  children: ReactNode;
  sceneKey: string | number;
}

function scrollAllToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  const root = document.getElementById('root');
  if (root) root.scrollTop = 0;
}

const SceneWrapper = ({ children, sceneKey }: SceneWrapperProps) => {
  const handleAnimationStart = useCallback(() => {
    scrollAllToTop();
  }, []);

  const handleAnimationComplete = useCallback(() => {
    scrollAllToTop();
    // Extra safety: scroll again after a frame to catch late layout shifts
    requestAnimationFrame(() => scrollAllToTop());
  }, []);

  return (
    <AnimatePresence mode="wait" onExitComplete={scrollAllToTop}>
      <motion.div
        key={sceneKey}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex-1 flex flex-col w-full h-full"
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default SceneWrapper;

