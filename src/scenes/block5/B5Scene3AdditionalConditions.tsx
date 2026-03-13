import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DandySpeechBubble from "../../components/DandySpeechBubble";
import NavigationButtons from "../../components/NavigationButtons";

interface B5Scene3Props {
  t: (key: string) => string;
  onReady: () => void;
  onBack?: () => void;
}

const conditions = [
  {
    key: "d",
    stars: 5,
    starType: "silver" as const,
    color: "from-[#C026D3] to-[#D946EF]",
    bonusColor: "#C026D3",
    accentBorder: "border-fuchsia-300/60",
    bgCard: "bg-fuchsia-50/50",
  },
  {
    key: "sd",
    stars: 5,
    starType: "silver" as const,
    color: "from-[#D946EF] to-[#EC4899]",
    bonusColor: "#D946EF",
    accentBorder: "border-pink-300/60",
    bgCard: "bg-pink-50/60",
  },
  {
    key: "c",
    stars: 1,
    starType: "gold-large" as const,
    color: "from-[#F59E0B] to-[#D97706]",
    bonusColor: "#D97706",
    accentBorder: "border-amber-300/60",
    bgCard: "bg-amber-50/50",
  },
  {
    key: "a",
    stars: 2,
    starType: "gold" as const,
    color: "from-[#EA580C] to-[#C2410C]",
    bonusColor: "#EA580C",
    accentBorder: "border-orange-300/60",
    bgCard: "bg-orange-50/50",
  },
  {
    key: "p",
    stars: 3,
    starType: "gold" as const,
    color: "from-[#E11D48] to-[#BE123C]",
    bonusColor: "#E11D48",
    accentBorder: "border-rose-400/50",
    bgCard: "bg-rose-50/50",
  },
];

const StarRow = ({ count, delay, type }: { count: number; delay: number; type: "silver" | "gold" | "gold-large" }) => {
  const size = type === "gold-large" ? 30 : 22;
  return (
    <div className="flex gap-1 justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <motion.svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + i * 0.1, type: "spring", stiffness: 300 }}
          style={{
            filter: type === "silver"
              ? "drop-shadow(0 1px 2px rgba(120,120,140,0.5))"
              : "drop-shadow(0 1px 3px rgba(180,140,0,0.6))",
          }}
        >
          <defs>
            {type === "silver" ? (
              <linearGradient id={`s3-silver-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E8E8EC" />
                <stop offset="40%" stopColor="#C0C0C8" />
                <stop offset="70%" stopColor="#A8A8B2" />
                <stop offset="100%" stopColor="#D0D0D8" />
              </linearGradient>
            ) : (
              <linearGradient id={`s3-gold-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE066" />
                <stop offset="40%" stopColor="#FFD700" />
                <stop offset="70%" stopColor="#DAA520" />
                <stop offset="100%" stopColor="#FFC800" />
              </linearGradient>
            )}
          </defs>
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={type === "silver" ? `url(#s3-silver-${i})` : `url(#s3-gold-${i})`}
          />
        </motion.svg>
      ))}
    </div>
  );
};

const B5Scene3AdditionalConditions = ({ t, onReady, onBack }: B5Scene3Props) => {
  const [showIntro, setShowIntro] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleIntroComplete = () => {
    setTimeout(() => {
      setShowIntro(false);
      setTimeout(() => setShowContent(true), 300);
    }, 1200);
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="flex-1 px-5 py-6">
        <AnimatePresence mode="wait">
          {showIntro ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex items-center min-h-[60vh]"
            >
              <DandySpeechBubble text={t("b5.s3.dandy.intro")} onComplete={handleIntroComplete} />
            </motion.div>
          ) : showContent ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col flex-1"
            >
              {/* Title */}
              <motion.h2
                className="text-lg font-bold text-foreground text-center mb-1 leading-tight"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="block">{t("b5.s3.title.p1")}</span>
                <span className="block text-primary">{t("b5.s3.title.p2")}</span>
              </motion.h2>

              <motion.p
                className="text-sm text-muted-foreground text-center mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {t("b5.s3.desc")}
              </motion.p>

              {/* Status condition cards — vertical list */}
              <div className="space-y-3 mb-5">
                {conditions.map(({ key, stars, starType, color, bonusColor, accentBorder, bgCard }, i) => (
                  <motion.div
                    key={key}
                    className={`relative rounded-2xl ${bgCard} border-2 ${accentBorder} shadow-card overflow-hidden`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.45 }}
                  >
                    {/* Top row: name + stars | bonus + desc */}
                    <div className="flex items-start gap-0 px-3 pt-3 pb-2">
                      {/* Left: status name + stars */}
                      <div className="flex flex-col items-center w-[105px] shrink-0">
                        <div className={`bg-gradient-to-r ${color} rounded-xl px-2 py-1.5 mb-1.5 w-full min-h-[38px] flex items-center justify-center`}>
                          <p className="font-black text-white text-[10px] text-center tracking-wider leading-tight">
                            {t(`b5.s3.${key}.title`)}
                          </p>
                        </div>
                        <StarRow count={stars} delay={0.4 + i * 0.15} type={starType} />
                      </div>

                      {/* Right: bonus + bonusNote + desc */}
                      <div className="flex-1 pl-4">
                        <p className="text-sm text-muted-foreground">
                          {t(`b5.s3.${key}.bonus`).split(/(\d[\d\s]*PV|1%)/).map((part, j) =>
                            /\d[\d\s]*PV|1%/.test(part)
                              ? <span key={j} className="font-extrabold text-lg" style={{ color: bonusColor }}>{part}</span>
                              : part
                          )}
                        </p>
                        <p className="text-[10px] text-muted-foreground leading-snug">
                          {t(`b5.s3.${key}.bonusNote`)}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug"
                          dangerouslySetInnerHTML={{ __html: t(`b5.s3.${key}.desc`) }}
                        />
                        {/* Second condition with "or" divider */}
                        {key !== "d" && (
                          <>
                            <div className="flex items-center gap-2 my-1.5">
                              <div className="flex-1 h-px bg-primary/30" />
                              <span className="text-[10px] font-bold text-primary uppercase tracking-wider px-1">
                                {t("b5.s3.or")}
                              </span>
                              <div className="flex-1 h-px bg-primary/30" />
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-snug"
                              dangerouslySetInnerHTML={{ __html: t(`b5.s3.${key}.desc2`) }}
                            />
                          </>
                        )}
                      </div>
                    </div>

                    {/* Bottom: volume badge — always centered */}
                    <div className="flex justify-center pb-3">
                      <motion.div
                        className="inline-flex items-center bg-primary/10 border-2 border-primary/40 rounded-lg px-4 py-1"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.15 }}
                      >
                        <span className="text-sm font-black text-primary tracking-wide">
                          {t(`b5.s3.${key}.volume`)}
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {showContent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <NavigationButtons
            onBack={onBack}
            onNext={onReady}
            nextLabel={t("nav.next")}
            backLabel={t("nav.back")}
            showBack={!!onBack}
          />
        </motion.div>
      )}
    </div>
  );
};

export default B5Scene3AdditionalConditions;