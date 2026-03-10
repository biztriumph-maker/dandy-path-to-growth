import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DandySpeechBubble from "../../components/DandySpeechBubble";
import NavigationButtons from "../../components/NavigationButtons";
interface B3Scene1Props {
  t: (key: string) => string;
  onReady: () => void;
  onBack?: () => void;
}

const bonuses = [
  {
    titleKey: "b3.s1.bonus1.title",
    descKey: "b3.s1.bonus1.desc",
    emoji: "🤝",
    color: "from-purple-500/20 to-violet-500/10",
  },
  {
    titleKey: "b3.s1.bonus2.title",
    descKey: "b3.s1.bonus2.desc",
    emoji: "🔗",
    color: "from-blue-500/20 to-indigo-500/10",
  },
  {
    titleKey: "b3.s1.bonus4.title",
    descKey: "b3.s1.bonus4.desc",
    emoji: "🏆",
    color: "from-amber-500/20 to-yellow-500/10",
  },
  {
    titleKey: "b3.s1.bonus3.title",
    descKey: "b3.s1.bonus3.desc",
    emoji: "🎁",
    color: "from-pink-500/20 to-rose-500/10",
  },
];

const B3Scene1Bonuses = ({ t, onReady, onBack }: B3Scene1Props) => {
  const [showIntro, setShowIntro] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleIntroComplete = () => {
    setTimeout(() => {
      setShowIntro(false);
      setTimeout(() => setShowContent(true), 1500);
    }, 1500);
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
              <DandySpeechBubble text={t("b3.s1.dandy.intro")} onComplete={handleIntroComplete} />
            </motion.div>
          ) : showContent ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col flex-1"
            >
              <motion.h2
                className="text-2xl font-bold text-foreground text-center mb-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {t("b3.s1.title")}
              </motion.h2>

              <motion.p
                className="text-sm text-muted-foreground text-center mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {t("b3.s1.subtitle")}
              </motion.p>

              <div className="space-y-3 mb-5">
                {bonuses.map(({ titleKey, descKey, emoji, color }, i) => (
                  <motion.div
                    key={i}
                    className={`p-4 rounded-2xl bg-gradient-to-r ${color} border border-border shadow-card`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5 shrink-0">{emoji}</span>
                      <div className="flex-1">
                        <p className="font-bold text-foreground text-base">{t(titleKey)}</p>
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                            {t(descKey).split(/(\d+%|(?<!\p{L})(?:VIP|ВІП|ВИП)(?!\p{L}))/iu).map((part, j) => {
                              if (/\d+%/.test(part)) return <span key={j} className="font-extrabold text-lg text-primary">{part}</span>;
                              if (/^(VIP|ВІП|ВИП)$/i.test(part)) return <span key={j} className="text-primary font-bold">{part}</span>;
                              return part;
                            })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <DandySpeechBubble text={t("b3.s1.dandy.bottom")} />
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {showContent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
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

export default B3Scene1Bonuses;
