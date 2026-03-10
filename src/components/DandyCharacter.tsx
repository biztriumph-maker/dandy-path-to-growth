import { motion } from "framer-motion";

interface DandyCharacterProps {
  size?: "sm" | "md" | "lg";
  speaking?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 80,
  md: 120,
  lg: 160,
};

const DandyCharacter = ({ size = "md", speaking = false, className = "" }: DandyCharacterProps) => {
  const s = sizeMap[size];
  
  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Glow behind */}
      <div
        className="absolute rounded-full animate-pulse-glow"
        style={{
          width: s * 1.5,
          height: s * 1.5,
          background: "radial-gradient(circle, hsl(270 70% 75% / 0.35), transparent 70%)",
        }}
      />
      
      <svg
        width={s}
        height={s * 1.3}
        viewBox="0 0 120 156"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stem */}
        <ellipse cx="60" cy="140" rx="12" ry="6" fill="hsl(130 35% 55%)" opacity="0.7" />
        <rect x="57" y="100" width="6" height="45" rx="3" fill="hsl(130 40% 50%)" />
        
        {/* Body / Center orb */}
        <circle cx="60" cy="70" r="32" fill="url(#bodyGradient)" />
        <circle cx="60" cy="70" r="28" fill="url(#innerGlow)" opacity="0.6" />
        
        {/* Dandelion petals / fluff */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 60 + Math.cos(rad) * 38;
          const cy = 70 + Math.sin(rad) * 38;
          return (
            <motion.circle
              key={angle}
              cx={cx}
              cy={cy}
              r="7"
              fill="hsl(265 50% 85%)"
              opacity="0.7"
              animate={{ r: [7, 8.5, 7], opacity: [0.7, 0.9, 0.7] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: angle * 0.01,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Face */}
        {/* Eyes */}
        <motion.ellipse
          cx="50"
          cy="65"
          rx="4"
          ry={speaking ? 4.5 : 5}
          fill="hsl(260 30% 20%)"
          animate={speaking ? { ry: [5, 4, 5] } : {}}
          transition={{ duration: 0.8, repeat: speaking ? Infinity : 0 }}
        />
        <motion.ellipse
          cx="70"
          cy="65"
          rx="4"
          ry={speaking ? 4.5 : 5}
          fill="hsl(260 30% 20%)"
          animate={speaking ? { ry: [5, 4, 5] } : {}}
          transition={{ duration: 0.8, repeat: speaking ? Infinity : 0 }}
        />
        
        {/* Eye shine */}
        <circle cx="48" cy="63" r="1.5" fill="white" opacity="0.9" />
        <circle cx="68" cy="63" r="1.5" fill="white" opacity="0.9" />
        
        {/* Smile */}
        <motion.path
          d={speaking ? "M 50 78 Q 60 86 70 78" : "M 50 76 Q 60 84 70 76"}
          stroke="hsl(260 30% 20%)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          animate={speaking ? { d: ["M 50 78 Q 60 86 70 78", "M 50 78 Q 60 82 70 78", "M 50 78 Q 60 86 70 78"] } : {}}
          transition={{ duration: 1, repeat: speaking ? Infinity : 0 }}
        />
        
        {/* Cheeks */}
        <circle cx="43" cy="74" r="4" fill="hsl(340 60% 80%)" opacity="0.4" />
        <circle cx="77" cy="74" r="4" fill="hsl(340 60% 80%)" opacity="0.4" />

        <defs>
          <radialGradient id="bodyGradient" cx="0.4" cy="0.35">
            <stop offset="0%" stopColor="hsl(270 65% 75%)" />
            <stop offset="100%" stopColor="hsl(265 55% 55%)" />
          </radialGradient>
          <radialGradient id="innerGlow" cx="0.45" cy="0.4">
            <stop offset="0%" stopColor="hsl(275 80% 88%)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

export default DandyCharacter;
