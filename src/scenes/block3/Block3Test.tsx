import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import DandySpeechBubble from "../../components/DandySpeechBubble";
import InstructionCard from "../../components/InstructionCard";
import ProgressBar from "../../components/ProgressBar";
import { useDandyIsTyping } from "../../hooks/use-dandy";

interface Block3TestProps {
  t: (key: string) => string;
  onComplete: () => void;
  onBack?: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TOTAL_QUESTIONS = 3;

// Q1: What bonus do you get for personal recommendations?
// correct: "personal" (Бонус личных приглашений)
const Q1_OPTIONS = ["personal", "binary", "matching", "status"];

// Q2: What % does a VIP level partner earn?
// correct: "20"
const Q2_OPTIONS = ["5", "10", "15", "20"];

// Q3: Order levels from lowest to highest
const LEVELS_ORDER = ["client", "partner", "business", "elite", "vip"];

const Block3Test = ({ t, onComplete, onBack }: Block3TestProps) => {
  const [currentQ, setCurrentQ] = useState(1);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [finished, setFinished] = useState(false);
  const isTyping = useDandyIsTyping();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const scrollable = document.querySelector(".overflow-y-auto");
    if (scrollable) scrollable.scrollTop = 0;
  }, [currentQ]);

  // Q1 state
  const [q1Options, setQ1Options] = useState(() => shuffle(Q1_OPTIONS));
  const [q1Selected, setQ1Selected] = useState<string | null>(null);

  // Q2 state
  const [q2Options, setQ2Options] = useState(() => shuffle(Q2_OPTIONS));
  const [q2Selected, setQ2Selected] = useState<string | null>(null);

  // Q3 state — slot-based ordering
  const [q3Slots, setQ3Slots] = useState<(string | null)[]>(() => Array(LEVELS_ORDER.length).fill(null));
  const [q3Pool, setQ3Pool] = useState<string[]>(() => shuffle([...LEVELS_ORDER]));
  const [q3Errors, setQ3Errors] = useState<number[]>([]);
  const [q3Locked, setQ3Locked] = useState<boolean[]>(() => Array(LEVELS_ORDER.length).fill(false));
  const [q3Selected, setQ3Selected] = useState<string | null>(null);

  const handleWrongAnswer = useCallback(() => {
    const key = `b3test.q${currentQ}.hint`;
    const text = t(key);
    const delay = 1500 + text.length * 40 + 2000;
    setShowHint(true);
    setTimeout(() => {
      setShowHint(false);
    }, delay);
  }, [currentQ, t]);

  const handleCorrectAnswer = useCallback(() => {
    const key = `b3test.q${currentQ}.correct`;
    const text = t(key);
    const delay = 1500 + text.length * 40 + 1500;
    setScore((s) => s + 1);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      if (currentQ < TOTAL_QUESTIONS) {
        setCurrentQ((q) => q + 1);
      } else {
        setFinished(true);
      }
    }, delay);
  }, [currentQ, t]);

  // Q1 handler
  const handleQ1 = (val: string) => {
    if (showSuccess || showHint) return;
    setQ1Selected(val);
    if (val === "personal") {
      handleCorrectAnswer();
    } else {
      const hintText = t(`b3test.q${currentQ}.hint`);
      const delay = 1500 + hintText.length * 40 + 2000;
      handleWrongAnswer();
      setTimeout(() => setQ1Selected(null), delay);
    }
  };

  // Q2 handler
  const handleQ2 = (val: string) => {
    if (showSuccess || showHint) return;
    setQ2Selected(val);
    if (val === "20") {
      handleCorrectAnswer();
    } else {
      const hintText = t(`b3test.q${currentQ}.hint`);
      const delay = 1500 + hintText.length * 40 + 2000;
      handleWrongAnswer();
      setTimeout(() => setQ2Selected(null), delay);
    }
  };

  // Q3 handlers — slot-based
  const handleQ3TapPool = (level: string) => {
    if (showSuccess || showHint) return;
    setQ3Selected((prev) => (prev === level ? null : level));
  };

  const handleQ3TapSlot = (index: number) => {
    if (showSuccess || showHint) return;
    if (q3Locked[index]) return;
    const currentInSlot = q3Slots[index];
    if (q3Selected) {
      if (currentInSlot) {
        setQ3Pool((p) => [...p, currentInSlot]);
      }
      setQ3Slots((s) => { const next = [...s]; next[index] = q3Selected; return next; });
      setQ3Pool((p) => p.filter((s) => s !== q3Selected));
      setQ3Selected(null);
    } else if (currentInSlot) {
      setQ3Slots((s) => { const next = [...s]; next[index] = null; return next; });
      setQ3Pool((p) => [...p, currentInSlot]);
    }
  };

  const checkQ3 = () => {
    if (showSuccess || showHint) return;
    const allFilled = q3Slots.every((s) => s !== null);
    if (!allFilled) return;
    const errorIndices: number[] = [];
    const newLocked = [...q3Locked];
    q3Slots.forEach((level, i) => {
      if (level === LEVELS_ORDER[i]) {
        newLocked[i] = true;
      } else {
        errorIndices.push(i);
      }
    });
    if (errorIndices.length === 0) {
      setQ3Locked(newLocked);
      handleCorrectAnswer();
    } else {
      setQ3Errors(errorIndices);
      setQ3Locked(newLocked);
      const hintText = t(`b3test.q${currentQ}.hint`);
      const delay = 1500 + hintText.length * 40 + 2000;
      handleWrongAnswer();
      setTimeout(() => {
        const errorLevels = errorIndices.map((i) => q3Slots[i]!).filter(Boolean);
        setQ3Slots((s) => {
          const next = [...s];
          errorIndices.forEach((i) => { next[i] = null; });
          return next;
        });
        setQ3Pool(shuffle(errorLevels));
        setQ3Errors([]);
        setQ3Selected(null);
      }, delay);
    }
  };

  // Reset helpers
  const resetQuestion = (q: number) => {
    switch (q) {
      case 1:
        setQ1Options(shuffle(Q1_OPTIONS));
        setQ1Selected(null);
        break;
      case 2:
        setQ2Options(shuffle(Q2_OPTIONS));
        setQ2Selected(null);
        break;
      case 3:
        setQ3Slots(Array(LEVELS_ORDER.length).fill(null));
        setQ3Pool(shuffle([...LEVELS_ORDER]));
        setQ3Errors([]);
        setQ3Locked(Array(LEVELS_ORDER.length).fill(false));
        setQ3Selected(null);
        break;
    }
  };

  const handleBackQuestion = () => {
    if (showSuccess || showHint) return;
    if (currentQ > 1) {
      const prevQ = currentQ - 1;
      resetQuestion(prevQ);
      setScore((s) => Math.max(s - 1, 0));
      setShowHint(false);
      setShowSuccess(false);
      setCurrentQ(prevQ);
    } else if (onBack) {
      onBack();
    }
  };

  // ─── FINAL SCREEN ───
  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-6 sm:py-8 text-center gradient-hero">
        <motion.div
          className="space-y-6 max-w-sm sm:max-w-md w-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.div
            className="text-8xl mb-2"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            🏆
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {t("b3test.complete.title")}
          </h2>

          <motion.div
            className="p-6 sm:p-8 rounded-3xl gradient-primary shadow-button"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
          >
            <p className="text-5xl sm:text-6xl font-extrabold text-primary-foreground mb-2">
              {score} / {TOTAL_QUESTIONS}
            </p>
            <p className="text-lg sm:text-xl font-bold text-primary-foreground/80">
              🏅 {t("b3test.complete.badge")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <DandySpeechBubble text={t("b3test.complete.dandy")} />
          </motion.div>

          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <button
              className={`w-full px-6 py-4 rounded-full font-bold text-lg transition-all ${
                isTyping
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "gradient-primary text-primary-foreground shadow-button hover:opacity-90 active:scale-95"
              }`}
              onClick={() => !isTyping && onComplete()}
              disabled={isTyping}
            >
              {t("b3test.complete.back")}
            </button>
            <button
              className={`w-full px-6 py-3 rounded-full font-bold text-base transition-all ${
                isTyping
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95"
              }`}
              onClick={() => {
                if (isTyping) return;
                setCurrentQ(1);
                setScore(0);
                setShowHint(false);
                setShowSuccess(false);
                setFinished(false);
                resetQuestion(1);
                resetQuestion(2);
                resetQuestion(3);
              }}
              disabled={isTyping}
            >
              {t("b3test.complete.retry")}
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const getMascotText = () => {
    if (showSuccess) return t(`b3test.q${currentQ}.correct`);
    if (showHint) return t(`b3test.q${currentQ}.hint`);
    return null;
  };
  const mascotText = getMascotText();

  return (
    <div className="flex flex-col flex-1 min-h-screen max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto gradient-hero">
      {/* Header */}
      <div className="px-4 pt-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1">
            <ProgressBar
              current={currentQ}
              total={TOTAL_QUESTIONS}
              t={(key) => {
                if (key === "nav.step") return t("b3test.question");
                if (key === "nav.of") return t("nav.of");
                return t(key);
              }}
            />
          </div>
          <div className="flex-shrink-0 px-3 py-2 rounded-xl gradient-primary shadow-button">
            <span className="text-lg font-extrabold text-primary-foreground">
              {currentQ} / {TOTAL_QUESTIONS}
            </span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="px-4 sm:px-5 pt-4 pb-2 text-center">
        <motion.h1
          className="text-xl sm:text-2xl font-bold text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {t("b3test.title")}
        </motion.h1>
      </div>

      {/* Question area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          className="flex-1 px-4 sm:px-5 md:px-6 py-4 overflow-y-auto"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4 }}
        >
          {/* ─── Q1: Which bonus is for recommendations? ─── */}
          {currentQ === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">{t("b3test.q1.title")}</h2>
              <InstructionCard icon="🎯" text={t("b3test.q1.instruction")} active />
              <div className="space-y-3">
                {q1Options.map((opt) => {
                  const isSelected = q1Selected === opt;
                  const isCorrect = opt === "personal";
                  const bgClass = isSelected
                    ? showSuccess && isCorrect
                      ? "border-green-500 bg-green-50"
                      : showHint && !isCorrect
                      ? "border-destructive bg-destructive/5"
                      : "border-primary bg-primary/5"
                    : "border-border bg-card";
                  return (
                    <motion.button
                      key={opt}
                      className={`w-full p-4 rounded-2xl border-2 text-left font-semibold text-base transition-all ${bgClass}`}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleQ1(opt)}
                      disabled={showSuccess || showHint}
                    >
                      {t(`b3test.q1.opt.${opt}`)}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── Q2: What % does VIP earn? ─── */}
          {currentQ === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">{t("b3test.q2.title")}</h2>
              <InstructionCard icon="🎯" text={t("b3test.q2.instruction")} active />
              <div className="space-y-3">
                {q2Options.map((opt) => {
                  const isSelected = q2Selected === opt;
                  const isCorrect = opt === "20";
                  const bgClass = isSelected
                    ? showSuccess && isCorrect
                      ? "border-green-500 bg-green-50"
                      : showHint && !isCorrect
                      ? "border-destructive bg-destructive/5"
                      : "border-primary bg-primary/5"
                    : "border-border bg-card";
                  return (
                    <motion.button
                      key={opt}
                      className={`w-full p-4 rounded-2xl border-2 text-left font-semibold text-base transition-all ${bgClass}`}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleQ2(opt)}
                      disabled={showSuccess || showHint}
                    >
                      {opt}%
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── Q3: Order levels from lowest to highest ─── */}
          {currentQ === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">{t("b3test.q3.title")}</h2>
              <InstructionCard icon="🎯" text={t("b3test.q3.instruction")} active />

              {/* Slots */}
              <div className="space-y-2">
                {LEVELS_ORDER.map((_, i) => {
                  const level = q3Slots[i];
                  const isError = q3Errors.includes(i);
                  const isLocked = q3Locked[i];
                  return (
                    <motion.button
                      key={i}
                      className={`w-full p-3 rounded-xl border-2 text-center font-semibold text-sm transition-all min-h-[44px] ${
                        isLocked
                          ? "border-green-500 bg-green-50 text-green-700"
                          : isError
                          ? "border-destructive bg-destructive/10 text-destructive"
                          : level
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-dashed border-muted-foreground/30 bg-muted/30 text-muted-foreground"
                      }`}
                      onClick={() => handleQ3TapSlot(i)}
                      disabled={showSuccess || showHint || isLocked}
                      whileTap={!isLocked ? { scale: 0.97 } : undefined}
                    >
                      {level ? t(`b3.s3.pkg.${level}`) : `${i + 1}`}
                    </motion.button>
                  );
                })}
              </div>

              {/* Pool */}
              {q3Pool.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {q3Pool.map((level) => (
                    <motion.button
                      key={level}
                      className={`px-4 py-2 rounded-full border-2 font-semibold text-sm transition-all ${
                        q3Selected === level
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-foreground"
                      }`}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQ3TapPool(level)}
                      disabled={showSuccess || showHint}
                    >
                      {t(`b3.s3.pkg.${level}`)}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Check button */}
              {q3Slots.every((s) => s !== null) && !showSuccess && !showHint && (
                <motion.button
                  className="w-full py-3 rounded-full font-bold text-base gradient-primary text-primary-foreground shadow-button hover:opacity-90 active:scale-95 transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={checkQ3}
                >
                  {t("b3test.q3.check")}
                </motion.button>
              )}
            </div>
          )}

          {/* Mascot feedback */}
          <AnimatePresence>
            {mascotText && (
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <DandySpeechBubble text={mascotText} typingDelay={1500} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success checkmark */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                className="flex justify-center mt-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <span className="text-3xl">✅</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wrong icon */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                className="flex justify-center mt-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <span className="text-3xl">❓</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Back button */}
      <div className="flex items-center gap-3 px-4 sm:px-5 md:px-6 py-4 mt-auto bg-background/80 backdrop-blur-sm border-t border-border/50">
        <button
          type="button"
          className="flex items-center gap-1 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full bg-secondary text-secondary-foreground font-semibold text-sm sm:text-base hover:bg-secondary/80 active:scale-95 transition-all shadow-soft"
          onClick={handleBackQuestion}
        >
          <ChevronLeft className="w-4 h-4" />
          {t("nav.back")}
        </button>
      </div>
    </div>
  );
};

export default Block3Test;
