import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DandySpeechBubble from "../../components/DandySpeechBubble";
import NavigationButtons from "../../components/NavigationButtons";
import recommendationFlow from "../../assets/recommendation-flow.png";

const renderVIP = (text: string) => {
  if (typeof text !== "string") return text;
  const parts = text.split(/(VIP)/g);
  return parts.map((part, i) =>
    part === "VIP" ? (
      <span key={i} className="text-[hsl(265,60%,55%)] font-extrabold text-[1.15em] tracking-wide">VIP</span>
    ) : part
  );
};

interface B3Scene2Props {
  t: (key: string) => string;
  onReady: () => void;
  onBack?: () => void;
}

const levels = [
  { key: "client", pct: 5, fill: 25, tier: 0 },
  { key: "partner", pct: 10, fill: 50, tier: 1 },
  { key: "business", pct: 12, fill: 60, tier: 2 },
  { key: "elite", pct: 15, fill: 75, tier: 3 },
  { key: "vip", pct: 20, star: true, fill: 100, tier: 4 },
];

const tierStyles = [
  "bg-card border-border shadow-card",
  "bg-card border-border",
  "bg-card border-primary/20",
  "bg-primary/5 border-primary/30",
  "bg-gradient-to-r from-primary/15 to-accent/15 border-primary/50 ring-2 ring-primary/30",
];

const B3Scene2Personal = ({ t, onReady, onBack }: B3Scene2Props) => {
  const [showIntro, setShowIntro] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      setTimeout(() => setShowContent(true), 300);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

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
              <DandySpeechBubble text={t("b3.s2.dandy.intro")} />
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
                {renderVIP(t("b3.s2.title"))}
              </motion.h2>

              <motion.p
                className="text-sm text-muted-foreground text-center mb-5 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {t("b3.s2.subtitle")}
              </motion.p>

              <motion.div
                className="flex justify-center mb-5 w-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="relative w-full max-w-sm mx-auto">
                  <img
                    src={recommendationFlow}
                    alt="Recommendation flow"
                    className="w-[65%] mx-auto h-auto rounded-2xl"
                  />
                  <span className="absolute top-[0%] left-0 text-[11px] sm:text-xs font-semibold text-foreground leading-snug bg-white/95 dark:bg-card/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl border-2 border-primary/30 shadow-md">
                    {t("b3.s2.flow1")}
                  </span>
                  <span className="absolute top-[18%] right-0 text-[11px] sm:text-xs font-semibold text-foreground leading-snug bg-white/95 dark:bg-card/95 backdrop-blur-sm px-2 py-1.5 rounded-xl border-2 border-primary/30 shadow-md text-right max-w-[40%]">
                    {t("b3.s2.flow2")}
                  </span>
                  <span className="absolute bottom-[-4%] left-1/2 -translate-x-1/2 text-[11px] sm:text-xs font-semibold text-foreground leading-snug bg-white/95 dark:bg-card/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl border-2 border-primary/30 shadow-md text-center whitespace-nowrap">
                    {t("b3.s2.flow3")}
                  </span>
                </div>
              </motion.div>

              <div className="space-y-2 mb-5 w-full">
                {levels.map(({ key, pct, star, fill, tier }, i) => (
                  <motion.div
                    key={key}
                    className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${tierStyles[tier]}`}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.35 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                  >
                    <span className={`text-sm font-semibold w-20 shrink-0 ${star ? 'text-primary font-bold' : 'text-foreground'}`}>
                      {star && '⭐ '}{key === 'vip' ? renderVIP(t(`b3.s2.level.${key}`)) : t(`b3.s2.level.${key}`)}
                    </span>
                    <div className="flex-1 h-5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full gradient-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${fill}%` }}
                        transition={{ delay: 0.8 + i * 0.12, duration: 0.6 }}
                      />
                    </div>
                    <span className={`text-lg font-extrabold shrink-0 ${star ? 'text-primary' : 'text-foreground'}`}>
                      {pct}%
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.p
                className="text-sm text-muted-foreground text-center mb-4 italic w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                {t("b3.s2.note")}
              </motion.p>

              <motion.div
                className="p-4 rounded-2xl bg-card border border-border shadow-card mb-4 w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
              >
                <p className="font-bold text-foreground mb-2">{t("b3.s2.why.title")}</p>
                <div className="space-y-1 w-full">
                  <p className="text-sm text-muted-foreground">✔ {t("b3.s2.why1")}</p>
                  <p className="text-sm text-muted-foreground">✔ {t("b3.s2.why2")}</p>
                  <p className="text-sm text-muted-foreground">✔ {t("b3.s2.why3")}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                className="mb-4 w-full"
              >
                <DandySpeechBubble
                  text={t("b3.s2.dandy.bottom")}
                  onComplete={() => setShowNav(true)}
                />
              </motion.div>
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

export default B3Scene2Personal;
