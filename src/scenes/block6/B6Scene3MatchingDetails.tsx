import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DandySpeechBubble from "../../components/DandySpeechBubble";
import NavigationButtons from "../../components/NavigationButtons";

interface B6Scene3Props {
  t: (key: string) => string;
  onReady: () => void;
  onBack?: () => void;
}

const PRESETS = [0, 50, 150, 300, 500];

const B6Scene3MatchingDetails = ({ t, onReady, onBack }: B6Scene3Props) => {
  const [showIntro, setShowIntro] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [binaryPV, setBinaryPV] = useState(0);
  const [justClicked, setJustClicked] = useState<number | null>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout>>();

  const handlePreset = (val: number) => {
    setBinaryPV(val);
    setJustClicked(val);
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => setJustClicked(null), 1500);
  };

  const handleIntroComplete = () => {
    setTimeout(() => {
      setShowIntro(false);
      setTimeout(() => setShowContent(true), 300);
    }, 1500);
  };

  const calc = useMemo(() => {
    const matchingPool = binaryPV * 5;
    const minBinary = matchingPool * 0.2;
    const binaryMet = binaryPV >= minBinary;
    const payout = binaryMet ? matchingPool : Math.round(matchingPool * (binaryPV / minBinary));
    return { matchingPool, minBinary, binaryMet, payout };
  }, [binaryPV]);

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
              <DandySpeechBubble text={t("b6.s3.dandy.intro")} onComplete={handleIntroComplete} />
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
                className="text-lg sm:text-xl font-bold text-foreground text-center mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {t("b6.s3.title")}
              </motion.h2>

              {/* Matching calc info */}
              <motion.div
                className="p-4 rounded-2xl bg-gradient-to-br from-purple-400/20 to-fuchsia-400/15 border border-purple-400/25 shadow-card mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <p
                  className="text-sm text-foreground leading-relaxed [&>strong]:font-bold"
                  dangerouslySetInnerHTML={{ __html: t("b6.s2.calc") }}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {t("b6.s2.calcExample")}
                </p>
              </motion.div>

              {/* Binary PV input */}
              <motion.div
                className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border shadow-card mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <p className="text-sm font-semibold text-foreground mb-3">
                  {t("b6.s3.inputLabel")}
                </p>

                {/* Preset buttons */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {PRESETS.map((val) => (
                    <button
                      key={val}
                      onClick={() => handlePreset(val)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        binaryPV === val
                          ? `bg-fuchsia-500 text-white shadow-md scale-105${justClicked === val ? ' ring-2 ring-fuchsia-400/50' : ''}`
                          : "bg-white/10 text-foreground border border-border hover:bg-white/20"
                      }`}
                    >
                      {val} PV
                    </button>
                  ))}
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min={0}
                  max={1000}
                  step={10}
                  value={binaryPV}
                  onChange={(e) => setBinaryPV(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-white/15 accent-fuchsia-500 cursor-pointer"
                />
                <p className="text-center text-lg font-extrabold text-fuchsia-400 mt-2">
                  {binaryPV} PV
                </p>
              </motion.div>

              {/* Visual scheme - removed */}

              {/* Conditions */}
              <motion.div
                className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-500/25 shadow-card mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="font-bold text-foreground text-sm mb-2 flex items-center gap-2">
                  <span>⚠️</span> {t("b6.s3.conditions")}
                </p>
                <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-amber-400 font-bold shrink-0">1.</span>
                    <span dangerouslySetInnerHTML={{ __html: t("b6.s3.cond1") }} />
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-400 font-bold shrink-0">2.</span>
                    <span dangerouslySetInnerHTML={{ __html: t("b6.s3.cond2") }} />
                  </li>
                </ul>
              </motion.div>

              {/* Result */}
              <motion.div
                className="p-4 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/30 shadow-card mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
                <p className="font-bold text-foreground text-sm mb-3 text-center uppercase tracking-wide">
                  {t("b6.s3.result")}
                </p>

                <div className="flex items-center justify-center gap-2 text-lg font-extrabold">
                  <span className="text-fuchsia-400">{binaryPV} PV</span>
                  <span className="text-muted-foreground">×</span>
                  <span className="text-foreground">5</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="text-primary text-2xl">{calc.payout.toLocaleString()} PV</span>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-2">
                  {t("b6.s3.resultNote")}
                </p>
              </motion.div>

              {/* Dandy bottom */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <DandySpeechBubble text={t("b6.s3.dandy.bottom")} />
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {showContent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
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

export default B6Scene3MatchingDetails;
