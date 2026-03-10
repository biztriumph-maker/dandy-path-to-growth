import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DandySpeechBubble from "../../components/DandySpeechBubble";
import NavigationButtons from "../../components/NavigationButtons";

interface B6Scene2Props {
  t: (key: string) => string;
  onReady: () => void;
  onBack?: () => void;
}

const PACKAGES = ["partner", "business", "elite", "vip"] as const;
const STATUSES = ["mentor", "master", "advisor"] as const;

const PKG_GRADIENTS: Record<string, string> = {
  partner: "from-fuchsia-400 to-purple-500",
  business: "from-purple-500 to-purple-700",
  elite: "from-purple-700 to-purple-900",
  vip: "from-purple-900 to-gray-900",
};

/** Prevent line breaks between level number and word (e.g. "1 уровня" → "1\u00A0уровня") and make level labels bold */
const formatLevels = (html: string) =>
  html.replace(
    /(\d)\s+(уровня|уровень|level|деңгей|daraja|рівня|рівень)/gi,
    "<b>$1\u00A0$2</b>"
  );

const B6Scene2MatchingTable = ({ t, onReady, onBack }: B6Scene2Props) => {
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
              <DandySpeechBubble text={t("b6.s2.dandy.intro")} onComplete={handleIntroComplete} />
            </motion.div>
          ) : showContent ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col flex-1"
            >
              {/* Table heading */}
              <motion.h2
                className="text-lg sm:text-xl font-bold text-foreground text-center mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {t("b6.s2.title")}
              </motion.h2>

              {/* Status headers */}
              <motion.div
                className="rounded-2xl border border-white/20 overflow-hidden shadow-card mb-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="grid grid-cols-[72px_1fr_1fr_1fr]">
                  <div className="bg-white/10 backdrop-blur-sm" />
                  {STATUSES.map((s) => (
                    <div key={s} className="bg-white/10 backdrop-blur-sm px-1 py-3 text-center border-l border-white/15">
                      <span className="text-[10px] sm:text-xs font-extrabold tracking-wide text-foreground uppercase">
                        {t(`b6.s2.h.${s}`)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Table rows */}
                {PACKAGES.map((pkg, rowIdx) => (
                  <motion.div
                    key={pkg}
                    className={`grid grid-cols-[72px_1fr_1fr_1fr] border-t-[3px] border-border/60`}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + rowIdx * 0.15 }}
                  >
                    {/* Package name badge — vertical gradient like screenshot */}
                    <div className={`bg-gradient-to-b ${PKG_GRADIENTS[pkg]} flex items-center justify-center px-1 py-3`}>
                      <span className="text-[10px] sm:text-xs font-extrabold text-white tracking-wider uppercase [writing-mode:vertical-lr] rotate-180">
                        {t(`b6.s2.p.${pkg}`)}
                      </span>
                    </div>

                    {/* Cells for each status */}
                    {STATUSES.map((status) => (
                      <div
                        key={status}
                        className="bg-white/[0.03] px-2 py-3 flex items-center justify-center border-l border-border/30"
                      >
                        <span
                          className="text-[11px] sm:text-xs text-foreground leading-relaxed text-center [&>strong]:text-fuchsia-400 [&>strong]:font-extrabold [&>strong]:text-sm"
                          dangerouslySetInnerHTML={{ __html: formatLevels(t(`b6.s2.c.${pkg}.${status}`)) }}
                        />
                      </div>
                    ))}
                  </motion.div>
                ))}
              </motion.div>

              {/* Legend note */}
              <motion.div
                className="p-3 rounded-xl bg-muted/50 border border-border/50 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  {t("b6.s2.note")}
                </p>
              </motion.div>

              {/* Dandy bottom */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <DandySpeechBubble text={t("b6.s2.dandy.bottom")} />
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

export default B6Scene2MatchingTable;
