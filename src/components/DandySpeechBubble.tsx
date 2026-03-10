import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DandyCharacter from "./DandyCharacter";
import { dandyState } from "../hooks/use-dandy";
import { TypingEffect } from "./ui/typing-effect";

interface DandySpeechBubbleProps {
  text: string;
  size?: "sm" | "md";
  className?: string;
  typingDelay?: number; // duration of "dots" phase in ms before typing starts
  onComplete?: () => void;
}

const DandySpeechBubble = ({ text, size = "sm", className = "", typingDelay = 1500, onComplete }: DandySpeechBubbleProps) => {
  const [phase, setPhase] = useState<"dots" | "typing" | "done">("dots");
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Reset state for new text
    setPhase("dots");
    let stopped = false;
    
    // Notify that Dandy started typing
    dandyState.startTyping();

    // Exactly-once stop: used by both handleTypingComplete and cleanup
    const stop = () => {
      if (!stopped) {
        stopped = true;
        dandyState.stopTyping();
      }
    };
    stopRef.current = stop;

    // Phase 1: Wait with dots
    const dotsTimer = setTimeout(() => {
      if (!stopped) {
        setPhase("typing");
      }
    }, typingDelay);

    return () => {
      clearTimeout(dotsTimer);
      stop();
    };
  }, [text, typingDelay]);

  const handleTypingComplete = useCallback(() => {
    setPhase("done");
    if (onComplete) onComplete();
    // Small delay so the "done" phase renders before we signal typing is over
    setTimeout(() => {
      stopRef.current?.();
    }, 50);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 ${className}`}
    >
      <div className="flex-shrink-0 mt-1">
        <DandyCharacter size={size} speaking={phase !== "done"} />
      </div>
      <div className="relative flex-1 p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/25 border border-primary/30 shadow-md ring-1 ring-primary/10">
        {/* Speech bubble tail */}
        <div className="absolute left-[-8px] top-4 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-primary/20" />
        <AnimatePresence mode="wait">
          {phase === "dots" ? (
            <motion.div
              key="dots"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 py-1"
            >
              <span className="dandy-dot dandy-dot-1" />
              <span className="dandy-dot dandy-dot-2" />
              <span className="dandy-dot dandy-dot-3" />
            </motion.div>
          ) : (
            <motion.p
              key="text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-foreground italic font-normal leading-relaxed whitespace-pre-line dandy-typing"
            >
              <TypingEffect
                text={text}
                speed={0.04}
                showCursor={true}
                onComplete={handleTypingComplete}
              />
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DandySpeechBubble;
