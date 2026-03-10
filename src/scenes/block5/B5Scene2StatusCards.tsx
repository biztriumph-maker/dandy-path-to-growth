import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DandySpeechBubble from "../../components/DandySpeechBubble";
import NavigationButtons from "../../components/NavigationButtons";

interface B5Scene2Props {
  t: (key: string) => string;
  onReady: () => void;
  onBack?: () => void;
}

const statuses = [
  {
    key: "manager",
    stars: 1,
    color: "from-[#6B21A8] to-[#7C3AED]",
    bonusColor: "#6B21A8",
    accentBorder: "border-purple-300/60",
    bgCard: "bg-purple-50/70",
  },
  {
    key: "mentor",
    stars: 2,
    color: "from-[#7C3AED] to-[#8B5CF6]",
    bonusColor: "#7C3AED",
    accentBorder: "border-violet-300/60",
    bgCard: "bg-violet-50/60",
  },
  {
    key: "master",
    stars: 3,
    color: "from-[#8B5CF6] to-[#A855F7]",
    bonusColor: "#8B5CF6",
    accentBorder: "border-violet-200/60",
    bgCard: "bg-violet-50/50",
  },
  {
    key: "advisor",
    stars: 4,
    color: "from-[#A855F7] to-[#C026D3]",
    bonusColor: "#A855F7",
    accentBorder: "border-fuchsia-300/60",
    bgCard: "bg-fuchsia-50/60",
  },
];

/** Highlight numbers+PV, month counts, and "быстрый старт" / "quick start" */
const renderHighlighted = (text: string) =>
  text.split(/(\d[\d\s]*PV|\d+\s*(?:месяц[а-я]*|month[s]?|ай|oy)|быстрый старт|quick start|жылдам старт|tezkor start|швидкий старт)/i).map((part, i) => {
    if (/\d[\d\s]*PV/.test(part))
      return <span key={i} className="font-extrabold text-primary text-xs">{part}</span>;
    if (/\d+\s*(?:месяц|month|ай|oy|місяц)/i.test(part))
      return <span key={i} className="font-extrabold text-foreground">{part}</span>;
    if (/быстрый старт|quick start|жылдам старт|tezkor start|швидкий старт/i.test(part))
      return <span key={i} className="font-extrabold text-foreground">{part}</span>;
    return part;
  });

const StarRow = ({ count, delay }: { count: number; delay: number }) => (
  <div className="flex gap-1 justify-center">
    {Array.from({ length: count }).map((_, i) => (
      <motion.svg
        key={i}
        width={22}
        height={22}
        viewBox="0 0 24 24"
        fill="none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + i * 0.1, type: "spring", stiffness: 300 }}
        style={{ filter: "drop-shadow(0 1px 2px rgba(120,120,140,0.5))" }}
      >
        <defs>
          <linearGradient id={`silver-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8E8EC" />
            <stop offset="40%" stopColor="#C0C0C8" />
            <stop offset="70%" stopColor="#A8A8B2" />
            <stop offset="100%" stopColor="#D0D0D8" />
          </linearGradient>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={`url(#silver-${i})`}
        />
      </motion.svg>
    ))}
  </div>
);

const B5Scene2StatusCards = ({ t, onReady, onBack }: B5Scene2Props) => {
  const [showIntro, setShowIntro] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [showNav, setShowNav] = useState(false);

  const handleIntroComplete = () => {
    setTimeout(() => {
      setShowIntro(false);
      setTimeout(() => setShowContent(true), 1500);
    }, 1500);
  };

  /** Safe desc: returns empty string if translation falls back to the key */
  const getDesc = (key: string) => {
    const val = t(`b5.s2.${key}.desc`);
    return val && !val.startsWith("b5.s2.") ? val : "";
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto w-full">
      <div className="flex-1 px-5 py-6">
        <AnimatePresence mode="wait">
          {showIntro ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex items-center min-h-[60vh] w-full"
            >
              <DandySpeechBubble text={t("b5.s2.dandy.intro")} onComplete={handleIntroComplete} />
            </motion.div>
          ) : showContent ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col flex-1 w-full"
            >
              <motion.h2
                className="text-2xl font-bold text-foreground text-center mb-1 w-full"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {t("b5.s2.title")}
              </motion.h2>

              <motion.p
                className="text-sm text-muted-foreground text-center mb-5 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {t("b5.s2.subtitle")}
              </motion.p>

              {/* Dandy top */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mb-4 w-full"
              >
                <DandySpeechBubble
                  text={t("b5.s2.dandy.bottom")}
                  onComplete={() => setTimeout(() => {
                    setShowCards(true);
                    setTimeout(() => setShowNav(true), 1500);
                  }, 1500)}
                />
              </motion.div>

              {/* Status cards — vertical list with clear sequence */}
              {showCards && (
              <div className="space-y-3 mb-5 w-full">
                {statuses.map(({ key, stars, color, bonusColor, accentBorder, bgCard }, i) => {
                  const desc = getDesc(key);
                  return (
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
                              {t(`b5.s2.${key}.title`)}
                            </p>
                          </div>
                          <StarRow count={stars} delay={0.4 + i * 0.15} />
                        </div>

                        {/* Right: bonus + desc */}
                        <div className="flex-1 pl-4">
                          <p className="text-sm text-muted-foreground">
                            {t(`b5.s2.${key}.bonus`).split(/(\d[\d\s]*PV)/).map((part, j) =>
                              /\d[\d\s]*PV/.test(part)
                                ? <span key={j} className="font-extrabold text-lg" style={{ color: bonusColor }}>{part}</span>
                                : part
                            )}
                          </p>
                          {desc && (
                            <p className="text-[11px] text-muted-foreground mt-2.5 leading-snug whitespace-pre-line">
                              {renderHighlighted(desc)}
                            </p>
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
                            {t(`b5.s2.${key}.volume`)}
                          </span>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {showNav && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
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

export default B5Scene2StatusCards;
