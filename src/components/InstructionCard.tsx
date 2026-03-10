import React from "react";
import { motion } from "framer-motion";

interface InstructionCardProps {
  text: string;
  active: boolean;
  icon?: string;
  className?: string;
}

const InstructionCard = React.forwardRef<HTMLDivElement, InstructionCardProps>(
  ({ text, active, icon = "🎯", className = "" }, ref) => {
  if (!active) {
    return (
      <div ref={ref} className={`relative rounded-2xl border border-border/50 bg-muted/40 px-4 py-3 ${className}`}>
        <div className="flex items-center gap-3">
          <span className="text-lg opacity-30">{icon}</span>
          <p className="text-sm text-muted-foreground/50 font-medium line-through decoration-muted-foreground/30">{text}</p>
          <span className="text-base opacity-30 ml-auto">✅</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2, boxShadow: "0 8px 30px hsl(265 60% 55% / 0.22)" }}
    >
      {/* Gradient top line */}
      <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />

      {/* Vibrant card with gradient background */}
      <div className="relative border-2 border-primary/30 bg-gradient-to-r from-primary/15 via-primary/10 to-accent/10 backdrop-blur-md px-4 py-3.5 rounded-2xl shadow-soft">
        <div className="flex items-center gap-3">
          {/* Pulsing icon ring */}
          <div className="relative flex-shrink-0">
            {/* Outer pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/50"
              animate={{
                scale: [1, 1.6, 1],
                opacity: [0.7, 0, 0.7],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Icon container */}
            <div className="relative w-10 h-10 rounded-full gradient-primary shadow-button flex items-center justify-center">
              <span className="text-lg">{icon}</span>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground leading-snug">{text}</p>
          </div>

          {/* Bouncing pointing down emoji */}
          <motion.div
            className="flex-shrink-0 text-xl"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            👇
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});

InstructionCard.displayName = "InstructionCard";

export default InstructionCard;
