import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DandySpeechBubble from "../../components/DandySpeechBubble";
import NavigationButtons from "../../components/NavigationButtons";

interface B6Scene1Props {
  t: (key: string) => string;
  onReady: () => void;
  onBack?: () => void;
}

const B6Scene1MatchingIntro = ({ t, onReady, onBack }: B6Scene1Props) => {
  const [showIntro, setShowIntro] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleIntroComplete = () => {
    setTimeout(() => {
      setShowIntro(false);
      setTimeout(() => setShowContent(true), 300);
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
              <DandySpeechBubble text={t("b6.s1.dandy.intro")} onComplete={handleIntroComplete} />
            </motion.div>
          ) : showContent ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col flex-1"
            >
              {/* Heading */}
              <motion.div
                className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/10 border border-border shadow-card mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl shrink-0">🤝</span>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="font-bold text-foreground text-base">
                      {t("b6.s1.title")}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                      {t("b6.s1.subtitle")}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Key point 1 — source */}
              <motion.div
                className="p-4 rounded-2xl bg-gradient-to-r from-primary/15 to-accent/15 border border-primary/50 ring-2 ring-primary/30 shadow-card mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <p className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  {t("b6.s1.source.title")}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: t("b6.s1.source.desc") }} />
              </motion.div>

              {/* Conditions block */}
              <motion.div
                className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 shadow-card mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <p className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  {t("b6.s3.conditions")}
                </p>
                <ul className="space-y-2.5 mb-3">
                  <li className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                    <span className="text-primary font-bold mt-0.5 shrink-0">•</span>
                    <span dangerouslySetInnerHTML={{ __html: t("b6.s3.cond1") }} />
                  </li>
                  <li className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                    <span className="text-primary font-bold mt-0.5 shrink-0">•</span>
                    <span dangerouslySetInnerHTML={{ __html: t("b6.s3.cond2") }} />
                  </li>
                </ul>
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30">
                  <p className="text-sm text-destructive leading-relaxed" dangerouslySetInnerHTML={{ __html: t("b6.s3.cond3") }} />
                </div>
              </motion.div>

              {/* Proportion + Example (combined) */}
              <motion.div
                className="p-4 rounded-2xl bg-gradient-to-r from-accent/15 to-primary/15 border border-accent/50 ring-2 ring-accent/30 shadow-card mb-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <p className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  {t("b6.s1.proportion.title")}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: t("b6.s1.proportion.desc") }} />
                <div className="mt-3 p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                  <p className="text-sm text-foreground leading-relaxed flex items-center gap-2">
                    <span className="shrink-0">📝</span>
                    <span><strong>{t("b6.s1.example.title")}:</strong> {t("b6.s1.example.desc")}</span>
                  </p>
                </div>
              </motion.div>

              {/* Dandy bottom */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <DandySpeechBubble text={t("b6.s1.dandy.bottom")} />
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

export default B6Scene1MatchingIntro;
