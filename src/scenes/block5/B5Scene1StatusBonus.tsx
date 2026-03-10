import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DandySpeechBubble from "../../components/DandySpeechBubble";
import NavigationButtons from "../../components/NavigationButtons";

interface B5Scene1Props {
  t: (key: string) => string;
  onReady: () => void;
  onBack?: () => void;
}

const B5Scene1StatusBonus = ({ t, onReady, onBack }: B5Scene1Props) => {
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
              <DandySpeechBubble text={t("b5.s1.dandy.intro")} onComplete={handleIntroComplete} />
            </motion.div>
          ) : showContent ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col flex-1"
            >
              {/* Top heading: Бонусы за статусы */}
              <motion.div
                className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-border shadow-card mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl shrink-0">🏆</span>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="font-bold text-foreground text-base">
                      {t("b3.s1.bonus4.title")}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                      {t("b3.s1.bonus4.desc")}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Conditions block */}
              <motion.div
                className="p-4 rounded-2xl bg-gradient-to-r from-primary/15 to-accent/15 border border-primary/50 ring-2 ring-primary/30 shadow-card mb-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <p className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <span className="text-lg">📋</span>
                  {t("b5.s1.condition.title")}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: t("b5.s1.condition.desc") }} />
              </motion.div>

              {/* Dandy bottom */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <DandySpeechBubble text={t("b5.s1.dandy.bottom")} />
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

export default B5Scene1StatusBonus;
