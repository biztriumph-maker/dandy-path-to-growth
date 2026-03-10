import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DandySpeechBubble from "../components/DandySpeechBubble";
import { useDandyIsTyping } from "../hooks/use-dandy";

interface Scene1Props {
  onNext: () => void;
  t: (key: string) => string;
}

const Scene1Welcome = ({ onNext, t }: Scene1Props) => {
  const isTyping = useDandyIsTyping();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Ждем 2 секунды после того, как Денди закончил "печатать" (появился текст)
    if (!isTyping) {
      const timer = setTimeout(() => setShowButton(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowButton(false);
    }
  }, [isTyping]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-8 text-center">
      <motion.div
        className="mt-8 space-y-3 max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-foreground leading-tight">
          {t("welcome.title")}
        </h1>
      </motion.div>

      <motion.div
        className="mt-4 max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <DandySpeechBubble text={t("welcome.dandy")} />
      </motion.div>

      <div className="mt-10 h-16">
        <AnimatePresence>
          {showButton && (
            <motion.button
              className="px-10 py-4 rounded-full font-bold text-lg transition-all gradient-primary text-primary-foreground shadow-button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={onNext}
            >
              {t("welcome.start")} ✨
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Scene1Welcome;
