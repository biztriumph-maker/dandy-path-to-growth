import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DandySpeechBubble from "../../components/DandySpeechBubble";
import NavigationButtons from "../../components/NavigationButtons";

interface B4Scene1Props {
  t: (key: string) => string;
  onReady: () => void;
  onBack?: () => void;
  onStepChange?: (step: number, total: number) => void;
  initialStep?: number;
}

const TOTAL_STEPS = 5;
const DANDY_TYPING_DELAY = 1500;
const DANDY_REVEAL_BUFFER = 2500; // 2.5s pause after Dandy finishes typing before visuals appear

const DISTRIBUTION_ORDER: Array<"left" | "right"> = [
  "right", "right", "left",
];

const businessActivity = [
  { rank: "manager",       pv: 0 },
  { rank: "mentor",        pv: 0 },
  { rank: "master",        pv: 10 },
  { rank: "advisor",       pv: 20 },
  { rank: "director",      pv: 30 },
  { rank: "superDirector", pv: 50 },
  { rank: "consul",        pv: 100 },
  { rank: "ambassador",    pv: 200 },
  { rank: "president",     pv: 400 },
];

const PersonIcon = ({ color = "hsl(var(--primary))", size = 28 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="7" r="4" fill={color} />
    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" fill={color} />
  </svg>
);

const PointerIcon = ({ className = "" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5 3l14 9-8 2-4 8-2-19z" fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" strokeWidth="1" />
  </svg>
);

const B4Scene1Binary = ({ t, onReady, onBack, onStepChange, initialStep = 1 }: B4Scene1Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(initialStep);
  const [distributedCount, setDistributedCount] = useState(0);
  const [visualsReadyForStep, setVisualsReadyForStep] = useState<number | null>(null);
  const [allContentReady, setAllContentReady] = useState(false);
  const [showDandy, setShowDandy] = useState(step !== 1);

  // Report step changes to parent for progress bar
  useEffect(() => {
    onStepChange?.(step, TOTAL_STEPS);
    // Сброс скролла при смене шага
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const root = document.getElementById('root');
    if (root) root.scrollTop = 0;
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [step, onStepChange]);

  // Step 1: show Dandy after 1.5s delay (banner appears first)
  // Other steps: Dandy shows immediately
  useEffect(() => {
    if (step === 1) {
      setShowDandy(false);
      const timer = setTimeout(() => setShowDandy(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setShowDandy(true);
    }
  }, [step]);

  // Dandy text per step
  const dandyKey = (() => {
    if (step === 1) return "b4.s1.dandy.step1";
    if (step === 2) return "b4.s1.dandy.step2";
    if (step === 3) return "b4.s1.dandy.step3";
    if (step === 4) return "step4_combined"; // handled below
    if (step === 5) return "b4.s1.dandy.step7";
    return "b4.s1.dandy.step1";
  })();

  const dandyText = step === 4
    ? `${t("b4.s1.dandy.step4")}\n${t("b4.s1.dandy.step5")}`
    : t(dandyKey);

  // When step changes, hide visuals and cancel any pending reveal timer
  const dandyCompleteTimer = useRef<ReturnType<typeof setTimeout>>();
  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    // Cancel pending reveal timer on step change
    clearTimeout(dandyCompleteTimer.current);
  }, [step]);

  const handleDandyComplete = useCallback(() => {
    // After Dandy finishes typing, wait 1.5s then show visuals
    // Capture current step to prevent stale closures
    clearTimeout(dandyCompleteTimer.current);
    const s = stepRef.current;
    dandyCompleteTimer.current = setTimeout(() => {
      setVisualsReadyForStep(s);
    }, 1500);
  }, []);

  // Track when ALL visual content (including delayed animations) has appeared
  useEffect(() => {
    setAllContentReady(false);
    if (visualsReadyForStep !== step) return;
    // Step 5 has the business activity table with delay: 1.0s + animation
    const extraDelay = step === 5 ? 1400 : 300;
    const timer = setTimeout(() => setAllContentReady(true), extraDelay);
    return () => clearTimeout(timer);
  }, [visualsReadyForStep, step]);

  // Handle auto-distribution in step 4
  useEffect(() => {
    if (step === 4 && visualsReadyForStep === 4 && distributedCount < 3) {
      const timer = setTimeout(() => {
        setDistributedCount(c => c + 1);
      }, distributedCount === 0 ? 3500 : 3000);
      return () => clearTimeout(timer);
    }
  }, [step, visualsReadyForStep, distributedCount]);

  const handleNext = () => {
    if (step === 4 && distributedCount < 3) {
      return;
    }
    if (step === 5) {
      onReady();
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    if (step === 4 && distributedCount > 0) {
      setDistributedCount(0);
      setStep(3);
      return;
    }
    if (step > 1) {
      if (step === 5) {
        // Going back to step 4: reset distribution so auto-animation replays
        setDistributedCount(0);
      }
      setStep((s) => s - 1);
    } else if (onBack) {
      onBack();
    }
  };

  // Calculate placed people
  const leftPlaced = DISTRIBUTION_ORDER.slice(0, distributedCount).filter((s) => s === "left").length;
  const rightPlaced = DISTRIBUTION_ORDER.slice(0, distributedCount).filter((s) => s === "right").length;
  const waitingCount = step >= 4 ? Math.max(0, 3 - distributedCount) : 0;

  // Visuals wait for Dandy to finish + 1.5s delay via visualsReady
  const showVisuals = visualsReadyForStep === step;

  return (
    <div ref={containerRef} className="flex flex-col flex-1 overflow-y-auto">
      <div className="flex-1 px-4 sm:px-5 py-4 space-y-4">
        {/* Bonus Description (from B3S1) */}
        <AnimatePresence>
          {step === 1 && (
            <motion.div
              className="rounded-2xl bg-gradient-to-r from-blue-500/20 to-indigo-500/10 border border-border shadow-card origin-top overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0, padding: 0, margin: 0, overflow: "hidden" }}
              transition={{ duration: 0.4 }}
            >
              {/* Header */}
              <div className="flex items-start gap-3 p-4 pb-2">
                <span className="text-2xl mt-0.5 shrink-0">🔗</span>
                <div className="flex-1">
                  <p className="font-black text-foreground text-lg tracking-wide">{t("b3.s1.bonus2.title")}</p>
                  <p className="text-base font-medium text-foreground mt-1 whitespace-pre-line leading-relaxed">
                    {t("b3.s1.bonus2.desc").split(/(\d+%)/).map((part: string, j: number) => {
                      if (/\d+%/.test(part)) {
                        return <span key={j} className="font-bold text-xl text-primary">{part}</span>;
                      }
                      return <span key={j} className="text-muted-foreground">{part}</span>;
                    })}
                  </p>
                </div>
              </div>

              {/* Description rows */}
              <div className="px-4 pb-3 space-y-2">
                {/* Row 1: Client */}
                <div className="grid grid-cols-2 gap-3 rounded-xl bg-background/60 p-2.5">
                  <p className="text-xs font-bold text-foreground">
                    {t("b4.s1.bonusDesc.client").split(/(\u00ab[^»]+\u00bb)/).map((part: string, j: number) =>
                      /\u00ab/.test(part) ? <span key={j} className="font-extrabold text-primary">{part}</span> : part
                    )}
                  </p>
                  <p className="text-xs font-semibold text-destructive">{t("b4.s1.bonusDesc.clientResult")}</p>
                </div>
                {/* Row 2: Partner / Business */}
                <div className="grid grid-cols-2 gap-3 rounded-xl bg-background/60 p-2.5">
                  <p className="text-xs font-bold text-foreground">
                    {t("b4.s1.bonusDesc.partnerBiz").split(/(\u00ab[^»]+\u00bb)/).map((part: string, j: number) =>
                      /\u00ab/.test(part) ? <span key={j} className="font-extrabold text-primary">{part}</span> : part
                    )}
                  </p>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground">
                      {t("b4.s1.bonusDesc.partnerBizResult").split(/(\d+%)/).map((part: string, j: number) =>
                        /\d+%/.test(part) ? <span key={j} className="font-extrabold text-sm text-primary">{part}</span> : part
                      )}
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground">{t("b4.s1.bonusDesc.partnerBizResult2")}</p>
                  </div>
                </div>
                {/* Row 3: Elite / VIP */}
                <div className="grid grid-cols-2 gap-3 rounded-xl bg-background/60 p-2.5">
                  <p className="text-xs font-bold text-foreground">
                    {t("b4.s1.bonusDesc.eliteVip").split(/(\u00ab[^»]+\u00bb)/).map((part: string, j: number) =>
                      /\u00ab/.test(part) ? <span key={j} className="font-extrabold text-primary">{part}</span> : part
                    )}
                  </p>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground">
                      {t("b4.s1.bonusDesc.eliteVipResult1").split(/(\d+%|[\u0421С]\u043e\u0432\u0435\u0442\u043d\u0438\u043a|\u041a\u0435\u04a3\u0435\u0441\u0448\u0456|Advisor|Maslahatchi|\u0420\u0430\u0434\u043d\u0438\u043a)/).map((part: string, j: number) => {
                        if (/\d+%/.test(part)) return <span key={j} className="font-extrabold text-sm text-primary">{part}</span>;
                        if (/\u0421\u043e\u0432\u0435\u0442\u043d\u0438\u043a|\u041a\u0435\u04a3\u0435\u0441\u0448\u0456|Advisor|Maslahatchi|\u0420\u0430\u0434\u043d\u0438\u043a/i.test(part)) return <span key={j} className="font-extrabold text-primary">{part}</span>;
                        return part;
                      })}
                    </p>
                    <p className="text-xs font-semibold text-foreground">
                      {t("b4.s1.bonusDesc.eliteVipResult2").split(/(\d+%|Директор и выше|Директор жəне жоғары|Direktor va undan yuqori|Директор і вище|Director and above)/).map((part: string, j: number) => {
                        if (/\d+%/.test(part)) return <span key={j} className="font-extrabold text-sm text-primary">{part}</span>;
                        if (/Директор|Director|Direktor/i.test(part)) return <span key={j} className="font-extrabold text-primary">{part}</span>;
                        return part;
                      })}
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground">{t("b4.s1.bonusDesc.eliteVipResult3")}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dandy speech bubble */}
        {showDandy && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <DandySpeechBubble
              key={step === 4 ? "step4_combined" : dandyKey}
              text={dandyText}
              typingDelay={DANDY_TYPING_DELAY}
              onComplete={handleDandyComplete}
            />
          </motion.div>
        )}

        {/* Visual area — appears after Dandy finishes */}
        <AnimatePresence>
          {showVisuals && step >= 1 && (
            <motion.div
              className="flex flex-col items-center mt-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="relative w-full max-w-xs mx-auto">
                {/* User avatar above sheet — step 3-4 */}
                {step >= 3 && step <= 4 && (
                  <motion.div
                    className="flex flex-col items-center mb-3"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  >
                    <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center shadow-soft">
                      <PersonIcon color="hsl(var(--primary))" size={32} />
                    </div>
                    <span className="text-sm font-semibold text-primary mt-1.5">
                      {t("b4.s1.you")}
                    </span>
                  </motion.div>
                )}

                {/* Waiting people queue — step 4+ */}
                {step >= 4 && waitingCount > 0 && (
                  <motion.div
                    className="flex justify-center gap-3 mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {Array.from({ length: waitingCount }).map((_, i) => (
                      <motion.div
                        key={`wait-${i}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                      >
                        <PersonIcon color="#64748B" size={28} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Distribution indicator — step 4 */}
                {step === 4 && showVisuals && distributedCount < 3 && (
                  <motion.div
                    key={`dist-${distributedCount}`}
                    className="flex items-center justify-center gap-2 mb-3 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/30 shadow-sm"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 16 }}
                  >
                    <span className="text-sm font-bold text-primary whitespace-nowrap">
                      {t("b4.s1.placing")} {distributedCount + 1} →{" "}
                      <span className={
                        DISTRIBUTION_ORDER[distributedCount] === "left"
                          ? "text-[hsl(200,55%,45%)]"
                          : "text-[hsl(25,55%,45%)]"
                      }>
                        {DISTRIBUTION_ORDER[distributedCount] === "right"
                          ? t("b4.s1.rightBranch")
                          : t("b4.s1.leftBranch")}
                      </span>
                    </span>
                  </motion.div>
                )}

                {/* The sheet — steps 1-4 */}
                {step <= 4 && (
                <motion.div
                  className="relative bg-white shadow-xl shadow-slate-300 dark:shadow-black/40 border border-slate-200 dark:border-slate-800 overflow-hidden"
                  style={{ minHeight: step >= 4 ? 220 : 200 }}
                  layout
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {/* Dividing line — step 2+ */}
                  {step >= 2 && (
                    <motion.div
                      className="absolute left-1/2 -translate-x-px bg-border"
                      style={{ width: 2, top: 36 }}
                      initial={{ height: 0 }}
                      animate={{ height: step === 5 ? 260 : step >= 4 ? 195 : 160 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  )}

                  {/* Side labels — step 2+ */}
                  {step >= 2 && (
                    <>
                      <motion.div
                        className="absolute top-2.5 left-0 w-1/2 flex justify-center"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                          style={{
                            backgroundColor: "hsla(200, 55%, 50%, 0.12)",
                            color: "hsl(200, 55%, 45%)",
                          }}
                        >
                          {t("b4.s1.leftBranch")}
                        </span>
                      </motion.div>
                      <motion.div
                        className="absolute top-2.5 right-0 w-1/2 flex justify-center"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                          style={{
                            backgroundColor: "hsla(25, 55%, 50%, 0.12)",
                            color: "hsl(25, 55%, 45%)",
                          }}
                        >
                          {t("b4.s1.rightBranch")}
                        </span>
                      </motion.div>
                    </>
                  )}

                  {/* SVG connecting lines from top center down to partners */}
                  {step >= 4 && (leftPlaced > 0 || rightPlaced > 0) && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                      {/* Center top → LEFT partner (touch upper-right edge of circle) */}
                      {leftPlaced > 0 && (
                        <motion.line
                          x1="50%" y1="36" x2="31%" y2="68"
                          stroke="hsl(145,60%,40%)" strokeWidth="2" strokeDasharray="5,3"
                          initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        />
                      )}
                      {/* Center top → RIGHT P1 (touch upper-left edge of circle, mirror) */}
                      {rightPlaced > 0 && (
                        <motion.line
                          x1="50%" y1="36" x2="69%" y2="68"
                          stroke="hsl(145,60%,40%)" strokeWidth="2" strokeDasharray="5,3"
                          initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        />
                      )}
                      {/* RIGHT P1 bottom → RIGHT P2 top center */}
                      {rightPlaced > 1 && (
                        <motion.line
                          x1="79%" y1="118" x2="85%" y2="150"
                          stroke="hsl(145,60%,40%)" strokeWidth="2" strokeDasharray="5,3"
                          initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        />
                      )}
                      {/* V-branches: LEFT P1 → level 2 (below label → red top edge) */}
                      {step === 5 && leftPlaced > 0 && (
                        <>
                          <motion.line x1="25%" y1="116" x2="19%" y2="140" stroke="hsl(0,70%,50%)" strokeWidth="1.5" strokeDasharray="3,2" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.5 }} />
                          <motion.line x1="25%" y1="116" x2="31%" y2="140" stroke="hsl(0,70%,50%)" strokeWidth="1.5" strokeDasharray="3,2" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.5 }} />
                        </>
                      )}
                      {/* V-branches: RIGHT P2 → level 2 (below label → red top edge) */}
                      {step === 5 && rightPlaced > 1 && (
                        <>
                          <motion.line x1="85%" y1="210" x2="79%" y2="234" stroke="hsl(0,70%,50%)" strokeWidth="1.5" strokeDasharray="3,2" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.7 }} />
                          <motion.line x1="85%" y1="210" x2="91%" y2="234" stroke="hsl(0,70%,50%)" strokeWidth="1.5" strokeDasharray="3,2" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.7 }} />
                        </>
                      )}
                    </svg>
                  )}

                  {/* LEFT partner (level 1) — centered in left half via w-1/2 flex */}
                  {step >= 4 && leftPlaced > 0 && (
                    <div className="absolute left-0 w-1/2 flex justify-center" style={{ top: 56, zIndex: 2 }}>
                      <motion.div
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, x: 20, y: -10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ type: "spring", stiffness: 140, damping: 14 }}
                      >
                        <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-md border-2 border-[hsl(145,60%,40%)]"
                          style={{ backgroundColor: "hsla(145, 60%, 45%, 0.15)" }}>
                          <span className="text-[hsl(145,60%,35%)] font-extrabold text-lg">3</span>
                        </div>
                        <span className="text-[10px] font-bold mt-0.5" style={{ color: "hsl(145, 60%, 35%)" }}>
                          {t("b3.s3.pkg.partner")}
                        </span>
                      </motion.div>
                    </div>
                  )}

                  {/* Level 2 under LEFT partner */}
                  {step === 5 && leftPlaced > 0 && (
                    <div className="absolute left-0 w-1/2 flex justify-center" style={{ top: 140, zIndex: 2 }}>
                      <motion.div
                        className="flex gap-3"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-[hsl(0,70%,55%)]"
                          style={{ backgroundColor: "hsla(0, 70%, 55%, 0.12)" }}>
                          <PersonIcon color="hsl(0, 70%, 50%)" size={18} />
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-[hsl(0,70%,55%)]"
                          style={{ backgroundColor: "hsla(0, 70%, 55%, 0.12)" }}>
                          <PersonIcon color="hsl(0, 70%, 50%)" size={18} />
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* RIGHT partner 1 (level 1) — centered in right half via w-1/2 flex */}
                  {step >= 4 && rightPlaced > 0 && (
                    <div className="absolute right-0 w-1/2 flex justify-center" style={{ top: 56, zIndex: 2 }}>
                      <motion.div
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, x: -20, y: -10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ type: "spring", stiffness: 140, damping: 14 }}
                      >
                        <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-md border-2 border-[hsl(145,60%,40%)]"
                          style={{ backgroundColor: "hsla(145, 60%, 45%, 0.15)" }}>
                          <span className="text-[hsl(145,60%,35%)] font-extrabold text-lg">1</span>
                        </div>
                        <span className="text-[10px] font-bold mt-0.5" style={{ color: "hsl(145, 60%, 35%)" }}>
                          {t("b3.s3.pkg.partner")}
                        </span>
                      </motion.div>
                    </div>
                  )}

                  {/* RIGHT partner 2 (level 1) — along right triangle edge, lower-right */}
                  {step >= 4 && rightPlaced > 1 && (
                    <motion.div
                      className="absolute flex flex-col items-center"
                      style={{ left: "85%", top: 150, transform: "translateX(-50%)", zIndex: 2 }}
                      initial={{ opacity: 0, x: -15, y: -10 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ type: "spring", stiffness: 140, damping: 14 }}
                    >
                      <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-md border-2 border-[hsl(145,60%,40%)]"
                        style={{ backgroundColor: "hsla(145, 60%, 45%, 0.15)" }}>
                        <span className="text-[hsl(145,60%,35%)] font-extrabold text-lg">2</span>
                      </div>
                      <span className="text-[10px] font-bold mt-0.5" style={{ color: "hsl(145, 60%, 35%)" }}>
                        {t("b3.s3.pkg.partner")}
                      </span>
                    </motion.div>
                  )}

                  {/* Level 2 under RIGHT partner 2 — same style as left */}
                  {step === 5 && rightPlaced > 1 && (
                    <div className="absolute flex justify-center" style={{ left: "85%", top: 234, transform: "translateX(-50%)", zIndex: 2 }}>
                      <motion.div
                        className="flex gap-3"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7, type: "spring" }}
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-[hsl(0,70%,55%)]"
                          style={{ backgroundColor: "hsla(0, 70%, 55%, 0.12)" }}>
                          <PersonIcon color="hsl(0, 70%, 50%)" size={18} />
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-[hsl(0,70%,55%)]"
                          style={{ backgroundColor: "hsla(0, 70%, 55%, 0.12)" }}>
                          <PersonIcon color="hsl(0, 70%, 50%)" size={18} />
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Empty sheet placeholder — step 1 only */}
                  {step === 1 && (
                    <div className="flex items-center justify-center h-full min-h-[180px]">
                      <motion.div
                        className="w-6 h-6 rounded-full bg-muted/40"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      />
                    </div>
                  )}
                </motion.div>
                )}

                {/* Conclusion text after distribution (Original) */}
                {step === 4 && distributedCount >= 3 && (
                  <motion.div
                    className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/25"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <p className="text-sm font-semibold text-primary text-center leading-relaxed whitespace-pre-line">
                      {t("b4.s1.dandy.step6")}
                    </p>
                  </motion.div>
                )}

                {/* Activation info block after distribution */}
                {step === 4 && distributedCount >= 3 && (
                  <motion.div
                    className="mt-4 rounded-2xl bg-white border border-border shadow-card overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <div className="bg-[#8b348d] py-2.5 px-4">
                      <h3 className="text-white font-bold text-center uppercase tracking-wider">{t("b4.s1.activation.title")}</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded bg-[#8b348d] flex items-center justify-center shrink-0 mt-0.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <p className="text-xs text-foreground uppercase tracking-wide leading-relaxed" dangerouslySetInnerHTML={{ __html: t("b4.s1.activation.req1") }} />
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded justify-center shrink-0 border border-[#8b348d] flex items-center mt-0.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8b348d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <p className="text-xs text-foreground uppercase tracking-wide leading-relaxed" dangerouslySetInnerHTML={{ __html: t("b4.s1.activation.req2") }} />
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded justify-center shrink-0 border border-[#8b348d] flex items-center mt-0.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8b348d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <p className="text-xs text-foreground uppercase tracking-wide leading-relaxed" dangerouslySetInnerHTML={{ __html: t("b4.s1.activation.req3") }} />
                      </div>
                    </div>
                    <div className="bg-amber-50 border-t-2 border-amber-300 p-3 flex items-start gap-2">
                      <span className="text-lg shrink-0 mt-0.5">⚠️</span>
                      <p className="text-xs text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: t("b4.s1.activation.note") }} />
                    </div>
                  </motion.div>
                )}

                {/* Full purple binary tree — step 5 */}
                {step === 5 && (
                  <motion.div
                    className="relative w-full"
                    style={{ height: 360 }}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    {/* SVG dashed connection lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                      {/* Root → Level 1 (with broken lines under labels) */}
                      <line x1="50%" y1="60" x2="45%" y2="70" stroke="#8b348d" strokeWidth="2" strokeDasharray="6,4" opacity="0.5" />
                      <line x1="30%" y1="102" x2="25%" y2="112" stroke="#8b348d" strokeWidth="2" strokeDasharray="6,4" opacity="0.5" />
                      <line x1="50%" y1="60" x2="55%" y2="70" stroke="#8b348d" strokeWidth="2" strokeDasharray="6,4" opacity="0.5" />
                      <line x1="70%" y1="102" x2="75%" y2="112" stroke="#8b348d" strokeWidth="2" strokeDasharray="6,4" opacity="0.5" />
                      {/* L1-left → Level 2 */}
                      <line x1="25%" y1="152" x2="14%" y2="200" stroke="#8b348d" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.4" />
                      <line x1="25%" y1="152" x2="37%" y2="200" stroke="#8b348d" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.4" />
                      {/* L1-right → Level 2 */}
                      <line x1="75%" y1="152" x2="63%" y2="200" stroke="#8b348d" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.4" />
                      <line x1="75%" y1="152" x2="87%" y2="200" stroke="#8b348d" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.4" />
                      {/* L2 → Level 3 */}
                      <line x1="14%" y1="234" x2="8%" y2="278" stroke="#8b348d" strokeWidth="1" strokeDasharray="4,3" opacity="0.3" />
                      <line x1="14%" y1="234" x2="20%" y2="278" stroke="#8b348d" strokeWidth="1" strokeDasharray="4,3" opacity="0.3" />
                      <line x1="37%" y1="234" x2="31%" y2="278" stroke="#8b348d" strokeWidth="1" strokeDasharray="4,3" opacity="0.3" />
                      <line x1="37%" y1="234" x2="43%" y2="278" stroke="#8b348d" strokeWidth="1" strokeDasharray="4,3" opacity="0.3" />
                      <line x1="63%" y1="234" x2="57%" y2="278" stroke="#8b348d" strokeWidth="1" strokeDasharray="4,3" opacity="0.3" />
                      <line x1="63%" y1="234" x2="69%" y2="278" stroke="#8b348d" strokeWidth="1" strokeDasharray="4,3" opacity="0.3" />
                      <line x1="87%" y1="234" x2="81%" y2="278" stroke="#8b348d" strokeWidth="1" strokeDasharray="4,3" opacity="0.3" />
                      <line x1="87%" y1="234" x2="93%" y2="278" stroke="#8b348d" strokeWidth="1" strokeDasharray="4,3" opacity="0.3" />
                    </svg>

                    {/* "ВЫ" label */}
                    <div className="absolute left-1/2 -translate-x-1/2 text-center" style={{ top: -10, zIndex: 1 }}>
                      <span className="text-[13px] font-extrabold text-primary tracking-widest uppercase">{t("b4.s1.youShort")}</span>
                    </div>

                    {/* Root circle — person icon */}
                    <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 16, zIndex: 1 }}>
                      <div className="w-11 h-11 rounded-full bg-primary/20 border-[3px] border-primary flex items-center justify-center shadow-lg">
                        <PersonIcon color="hsl(var(--primary))" size={26} />
                      </div>
                    </div>

                    {/* Branch labels */}
                    <div className="absolute left-1/2 -translate-x-1/2 flex justify-center items-center w-[120%]" style={{ top: 76, zIndex: 1, gap: '40px' }}>
                      <span className="text-[13px] font-bold px-3 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: "hsla(200, 55%, 50%, 0.12)", color: "hsl(200, 55%, 45%)" }}>{t("b4.s1.leftBranch")}</span>
                      <span className="text-[13px] font-bold px-3 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: "hsla(25, 55%, 50%, 0.12)", color: "hsl(25, 55%, 45%)" }}>{t("b4.s1.rightBranch")}</span>
                    </div>

                    {/* Level 1: numbered filled circles "1" and "2" */}
                    <div className="absolute left-[25%] -translate-x-1/2" style={{ top: 108, zIndex: 1 }}>
                      <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-md border-[3px] border-[hsl(145,60%,40%)]" style={{ backgroundColor: "hsla(145, 60%, 45%, 0.15)" }}>
                        <span className="text-[hsl(145,60%,35%)] font-extrabold text-lg">3</span>
                      </div>
                    </div>
                    <div className="absolute left-[75%] -translate-x-1/2" style={{ top: 108, zIndex: 1 }}>
                      <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-md border-[3px] border-[hsl(145,60%,40%)]" style={{ backgroundColor: "hsla(145, 60%, 45%, 0.15)" }}>
                        <span className="text-[hsl(145,60%,35%)] font-extrabold text-lg">1</span>
                      </div>
                    </div>

                    {/* Level 2 under "1": two person circles */}
                    <div className="absolute left-[14%] -translate-x-1/2" style={{ top: 200, zIndex: 1 }}>
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-[#8b348d] flex items-center justify-center shadow-md">
                        <PersonIcon color="#8b348d" size={18} />
                      </div>
                    </div>
                    <div className="absolute left-[37%] -translate-x-1/2" style={{ top: 200, zIndex: 1 }}>
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-[#8b348d] flex items-center justify-center shadow-md">
                        <PersonIcon color="#8b348d" size={18} />
                      </div>
                    </div>

                    {/* Level 2 under "2": person circle + filled "3" */}
                    <div className="absolute left-[63%] -translate-x-1/2" style={{ top: 200, zIndex: 1 }}>
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-[#8b348d] flex items-center justify-center shadow-md">
                        <PersonIcon color="#8b348d" size={18} />
                      </div>
                    </div>
                    <div className="absolute left-[87%] -translate-x-1/2" style={{ top: 196, zIndex: 1 }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md border-[2.5px] border-[hsl(145,60%,40%)]" style={{ backgroundColor: "hsla(145, 60%, 45%, 0.15)" }}>
                        <span className="text-[hsl(145,60%,35%)] font-extrabold text-base">2</span>
                      </div>
                    </div>

                    {/* Level 3: 8 small person circles */}
                    {[8, 20, 31, 43, 57, 69, 81, 93].map((pct, i) => (
                      <div key={`l3-${i}`} className="absolute -translate-x-1/2" style={{ left: `${pct}%`, top: 275, zIndex: 1 }}>
                        <div className="w-6 h-6 rounded-full bg-white border-[1.5px] border-[#8b348d] flex items-center justify-center shadow-sm">
                          <PersonIcon color="#8b348d" size={14} />
                        </div>
                      </div>
                    ))}

                    {/* "и до бесконечности...." text at bottom */}
                    <div className="absolute left-[25%] -translate-x-1/2 text-center w-36" style={{ top: 312, zIndex: 1 }}>
                      <span className="text-[13px] font-bold text-[#8b348d]/80 italic leading-tight">{t("b4.s1.infinite")}</span>
                    </div>
                    <div className="absolute left-[75%] -translate-x-1/2 text-center w-36" style={{ top: 312, zIndex: 1 }}>
                      <span className="text-[13px] font-bold text-[#8b348d]/80 italic leading-tight">{t("b4.s1.infinite")}</span>
                    </div>
                  </motion.div>
                )}

                {/* Growth explanation text */}
                {step === 5 && (
                  <motion.div
                    className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/15"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <p className="text-sm text-foreground text-center leading-relaxed whitespace-pre-line">
                      {t("b4.s1.dandy.step7done")}
                    </p>
                    <p className="text-sm text-foreground text-center leading-relaxed whitespace-pre-line mt-2">
                      {t("b4.s1.growth")}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Бизнес-активность */}
        {step === 5 && showVisuals && (
          <motion.div
            className="rounded-2xl overflow-hidden border-2 border-[#7b2d8e]/30 shadow-soft mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <div className="bg-gradient-to-r from-[#7b2d8e] to-[#a94cbf] px-4 py-3">
              <p className="text-sm text-white/90 text-center leading-snug">
                {t("b4.s2.ba.subtitle")}{" "}
                <strong className="font-extrabold text-white">{t("b4.s2.ba.subtitleBold")}</strong>
              </p>
            </div>
            <div className="divide-y divide-[#7b2d8e]/10">
              {businessActivity.map((row, i) => (
                <div
                  key={row.rank}
                  className={`flex items-center ${
                    i % 2 === 0 ? "bg-[#7b2d8e]/5" : "bg-[#7b2d8e]/10"
                  }`}
                >
                  <div className="flex-1 px-4 py-2.5">
                    <span className="text-sm font-bold text-foreground uppercase">
                      {t(`b4.s2.ba.rank.${row.rank}`)}
                    </span>
                  </div>
                  <div className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#7b2d8e]/60 to-[#9b3bb5]/50">
                    <span className="text-sm font-bold text-white text-center block">
                      {row.pv === 0 ? t("b4.s2.ba.notProvided") : `${row.pv} PV`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <NavigationButtons
        onBack={handleBack}
        onNext={handleNext}
        nextLabel={t("nav.next")}
        backLabel={t("nav.back")}
        nextDisabled={step === 4 ? distributedCount < 3 : !allContentReady}
        backDisabled={step === 4 ? distributedCount < 3 : !allContentReady}
        showBack={step > 1 || !!onBack}
      />
    </div>
  );
};

export default B4Scene1Binary;
