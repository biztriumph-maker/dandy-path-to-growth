import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DandySpeechBubble from "../../components/DandySpeechBubble";
import InstructionCard from "../../components/InstructionCard";
import NavigationButtons from "../../components/NavigationButtons";

const renderVIP = (text: string) => {
  if (typeof text !== "string") return text;
  const parts = text.split(/(VIP)/g);
  return parts.map((part, i) =>
    part === "VIP" ? (
      <span key={i} className="text-[hsl(265,60%,55%)] font-extrabold text-[1.15em] tracking-wide">VIP</span>
    ) : part
  );
};

interface B3Scene3Props {
  t: (key: string) => string;
  onReady: () => void;
  onBack?: () => void;
}

const packages = [
  { key: "client", pv: 60 },
  { key: "partner", pv: 120 },
  { key: "business", pv: 180 },
  { key: "elite", pv: 240 },
];
const VIP_PV = 324;
const thresholds = [...packages, { key: "vip", pv: VIP_PV }];

const B3Scene3Calculators = ({ t, onReady, onBack }: B3Scene3Props) => {
  const [dandyDone, setDandyDone] = useState(false);
  const [vipMode, setVipMode] = useState<"instant" | "cumulative" | null>(null);
  const [cumulativePackages, setCumulativePackages] = useState<number[]>([]);
  const [justClicked, setJustClicked] = useState<string | null>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleModeClick = (mode: "instant" | "cumulative") => {
    setVipMode(mode);
    setJustClicked(mode);
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => setJustClicked(null), 1500);
  };

  const cumulativePV = cumulativePackages.reduce((sum, idx) => sum + packages[idx].pv, 0);

  const currentActivatedPkg = (() => {
    let bestKey = "";
    for (const th of thresholds) {
      if (cumulativePV >= th.pv) bestKey = th.key;
    }
    if (!bestKey) return "—";
    return bestKey === "vip" ? "VIP" : t(`b3.s3.pkg.${bestKey}`);
  })();

  const remainingPV = Math.max(0, VIP_PV - cumulativePV);
  const vipProgress = Math.min(100, (cumulativePV / VIP_PV) * 100);

  const addPackage = (idx: number) => setCumulativePackages((prev) => [...prev, idx]);
  const removeLastPackage = () => setCumulativePackages((prev) => prev.slice(0, -1));

  const isNextEnabled = vipMode === "instant" || (vipMode === "cumulative" && cumulativePV >= VIP_PV);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto w-full">
      <div className="flex-1 px-5 py-6">
        {/* Dandy's speech */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 w-full"
        >
          <DandySpeechBubble
            text={t("b3.s3.dandy.intro")}
            onComplete={() => setDandyDone(true)}
          />
        </motion.div>

        {/* Spacer + calculator only appears after Dandy finishes */}
        <AnimatePresence>
          {dandyDone && (
            <motion.div
              key="calc-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col w-full"
            >


              {/* Calculator title */}
              <h2 className="text-xl font-bold text-foreground text-center mb-3 w-full">
                🟣 {renderVIP(t("b3.s3.calc1.title"))}
              </h2>

              {/* Choose variant instruction */}
              <AnimatePresence>
                {vipMode === null && (
                  <motion.div
                    key="choose-instruction"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="mb-3 w-full"
                  >
                    <InstructionCard
                      text={renderVIP(t("b3.s3.calc1.chooseVariant")) as any}
                      active={true}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mode buttons */}
              <div className="flex gap-2 mb-4 w-full">
                {(["instant", "cumulative"] as const).map((mode) => (
                  <motion.button
                    key={mode}
                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all border-2 ${
                      vipMode === mode
                        ? `border-primary bg-primary/10 text-primary${justClicked === mode ? ' ring-2 ring-primary/50' : ''}`
                        : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                    }`}
                    whileHover={vipMode !== mode ? { scale: 1.03, y: -4 } : {}}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleModeClick(mode)}
                  >
                    {renderVIP(t(`b3.s3.calc1.${mode}`))}
                  </motion.button>
                ))}
              </div>

              {/* Content for the chosen mode */}
              <AnimatePresence mode="wait">
                {vipMode === "instant" && (
                  <motion.div
                    key="instant-content"
                    className="p-4 rounded-2xl bg-card border border-border shadow-card space-y-3 w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {renderVIP(t("b3.s3.calc1.instantDesc"))}
                    </p>
                    <p className="text-sm text-foreground">✔ {renderVIP(t("b3.s3.calc1.vipActive"))}</p>
                    <p className="text-sm text-foreground">✔ {renderVIP(t("b3.s3.calc1.discount"))}</p>
                  </motion.div>
                )}

                {vipMode === "cumulative" && (
                  <motion.div
                    key="cumulative-content"
                    className="space-y-3 w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <AnimatePresence>
                      {cumulativePackages.length === 0 && (
                        <motion.div
                          key="task-instruction"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          className="w-full"
                        >
                          <InstructionCard
                            text={renderVIP(t("b3.s3.calc1.task")) as any}
                            active={true}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="grid grid-cols-2 gap-2 w-full">
                      {packages.map((p, i) => (
                        <motion.button
                          key={p.key}
                          className="py-2.5 px-3 rounded-xl border-2 border-border bg-card text-sm font-semibold text-foreground transition-all hover:border-primary/40"
                          whileHover={{ scale: 1.03, y: -4 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => addPackage(i)}
                        >
                          + {t(`b3.s3.pkg.${p.key}`)} ({p.pv} PV)
                        </motion.button>
                      ))}
                    </div>

                    {cumulativePackages.length > 0 && (
                      <motion.button
                        className="text-sm text-muted-foreground underline"
                        onClick={removeLastPackage}
                        whileTap={{ scale: 0.95 }}
                      >
                        {t("b3.s3.calc1.undo")}
                      </motion.button>
                    )}

                    <div className="p-4 rounded-2xl bg-card border border-border shadow-card space-y-2 w-full">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t("b3.s3.calc1.accumulated")}</span>
                        <span className="font-bold text-foreground">{cumulativePV} PV</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t("b3.s3.calc1.activated")}</span>
                        <span className="font-bold text-foreground">{renderVIP(currentActivatedPkg)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t("b3.s3.calc1.remaining")}</span>
                        <span className="font-bold text-primary">{remainingPV} PV</span>
                      </div>
                      <div className="h-3 bg-secondary rounded-full overflow-hidden mt-1">
                        <motion.div
                          className="h-full rounded-full gradient-primary"
                          animate={{ width: `${vipProgress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      {cumulativePV >= VIP_PV && (
                        <p className="text-sm font-bold text-[hsl(265,60%,55%)] text-center mt-1">
                          🎉 {renderVIP(`VIP ${t("b3.s3.calc1.reached")}!`)}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation — only after task is done */}
      {dandyDone && isNextEnabled && (
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

export default B3Scene3Calculators;
