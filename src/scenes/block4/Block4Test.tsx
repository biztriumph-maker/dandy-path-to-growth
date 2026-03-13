import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import DandySpeechBubble from "../../components/DandySpeechBubble";
import InstructionCard from "../../components/InstructionCard";
import ProgressBar from "../../components/ProgressBar";
import { HighlightVip } from "../../components/HighlightVip";
import { useDandyIsTyping } from "../../hooks/use-dandy";

interface Block4TestProps {
  t: (key: string) => string;
  onComplete: () => void;
  onBack?: () => void;
}

// Shuffle helper
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TOTAL_QUESTIONS = 5;

// ─── Task 2 variants ───
type Task2Variant = "A" | "B" | "C";

// ─── Task 3 variants ───
interface Task3Config {
  packageKey: string;
  correctPV: string;
}
const task3Variants: Task3Config[] = [
  { packageKey: "partner", correctPV: "500" },
  { packageKey: "business", correctPV: "1000" },
  { packageKey: "elite", correctPV: "2000" },
  { packageKey: "vip", correctPV: "8000" },
];

// ─── Task 5 configs ───
interface Task5Config {
  target: number;
  numbers: number[];
}
const task5Configs: Task5Config[] = [
  { target: 300, numbers: [100, 200, 300, 500, 700] },
  { target: 500, numbers: [300, 500, 700, 900, 1200] },
  { target: 900, numbers: [500, 700, 900, 1200, 1500] },
];

// ─── Person icon for Task 4 diagrams ───
const PersonIcon = ({
  color = "hsl(var(--primary))",
  size = 24,
}: {
  color?: string;
  size?: number;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="7" r="4" fill={color} />
    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" fill={color} />
  </svg>
);

// ─── Main component ───
const Block4Test = ({ t, onComplete, onBack }: Block4TestProps) => {
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

  // ─── Q1 state ───
  const [q1Options] = useState(() =>
    shuffle([
      { id: "a", textKey: "b4test.q1.optA" },
      { id: "b", textKey: "b4test.q1.optB" },
      { id: "c", textKey: "b4test.q1.optC" },
      { id: "d", textKey: "b4test.q1.optD" },
    ])
  );
  const [q1Selected, setQ1Selected] = useState<string | null>(null);

  // ─── Q2 state ───
  const [q2Variant] = useState<Task2Variant>(
    () => {
      const r = Math.random();
      return r < 1 / 3 ? "A" : r < 2 / 3 ? "B" : "C";
    }
  );
  const [q2Options] = useState(() => shuffle(["4", "6", "8", "10"]));
  const [q2Selected, setQ2Selected] = useState<string | null>(null);

  // ─── Q3 state ───
  const [q3Config] = useState(
    () => task3Variants[Math.floor(Math.random() * task3Variants.length)]
  );
  const [q3Options] = useState(() => shuffle(["500", "1000", "2000", "8000"]));
  const [q3Selected, setQ3Selected] = useState<string | null>(null);

  // ─── Q4 state ───
  const [q4Selected, setQ4Selected] = useState<number | null>(null);

  // ─── Q5 state ───
  const [q5Config] = useState(
    () => task5Configs[Math.floor(Math.random() * task5Configs.length)]
  );
  const [q5LeftSlot, setQ5LeftSlot] = useState<number | null>(null);
  const [q5RightSlot, setQ5RightSlot] = useState<number | null>(null);
  const [q5DragSource, setQ5DragSource] = useState<"pool" | "left" | "right" | null>(null);
  const [q5DragValue, setQ5DragValue] = useState<number | null>(null);

  // ─── Common handlers ───
  const handleWrongAnswer = useCallback(() => {
    const key = `b4test.q${currentQ}.hint`;
    const text = t(key);
    const delay = 1500 + text.length * 40 + 2000;
    setShowHint(true);
    setTimeout(() => {
      setShowHint(false);
    }, delay);
  }, [currentQ, t]);

  const handleCorrectAnswer = useCallback(() => {
    const key = `b4test.q${currentQ}.correct`;
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

  // ─── Q1 handler ───
  const handleQ1 = (id: string) => {
    if (showSuccess || showHint) return;
    setQ1Selected(id);
    if (id === "b") {
      handleCorrectAnswer();
    } else {
      const hintText = t(`b4test.q${currentQ}.hint`);
      const delay = 1500 + hintText.length * 40 + 2000;
      handleWrongAnswer();
      setTimeout(() => setQ1Selected(null), delay);
    }
  };

  // ─── Q2 handler ───
  const handleQ2 = (val: string) => {
    if (showSuccess || showHint) return;
    setQ2Selected(val);
    const correctAnswer = q2Variant === "A" ? "6" : q2Variant === "B" ? "10" : "8";
    if (val === correctAnswer) {
      handleCorrectAnswer();
    } else {
      const hintText = t(`b4test.q${currentQ}.hint`);
      const delay = 1500 + hintText.length * 40 + 2000;
      handleWrongAnswer();
      setTimeout(() => setQ2Selected(null), delay);
    }
  };

  // ─── Q3 handler ───
  const handleQ3 = (val: string) => {
    if (showSuccess || showHint) return;
    setQ3Selected(val);
    if (val === q3Config.correctPV) {
      handleCorrectAnswer();
    } else {
      const hintText = t(`b4test.q${currentQ}.hint`);
      const delay = 1500 + hintText.length * 40 + 2000;
      handleWrongAnswer();
      setTimeout(() => setQ3Selected(null), delay);
    }
  };

  // ─── Q4 handler ───
  const handleQ4 = (idx: number) => {
    if (showSuccess || showHint) return;
    setQ4Selected(idx);
    // Correct is image 3 (index 2): 1 left, 2 right
    if (idx === 2) {
      handleCorrectAnswer();
    } else {
      const hintText = t(`b4test.q${currentQ}.hint`);
      const delay = 1500 + hintText.length * 40 + 2000;
      handleWrongAnswer();
      setTimeout(() => setQ4Selected(null), delay);
    }
  };

  // ─── Q5 handler ───
  const q5AvailableNumbers = useMemo(() => {
    return q5Config.numbers.filter(
      (n) => n !== q5LeftSlot && n !== q5RightSlot
    );
  }, [q5Config.numbers, q5LeftSlot, q5RightSlot]);

  const handleQ5DragStart = (
    value: number,
    source: "pool" | "left" | "right"
  ) => {
    setQ5DragSource(source);
    setQ5DragValue(value);
  };

  const handleQ5DropOnSlot = (slot: "left" | "right") => {
    if (q5DragValue === null) return;

    // Remove from the old slot if coming from a slot
    if (q5DragSource === "left") setQ5LeftSlot(null);
    if (q5DragSource === "right") setQ5RightSlot(null);

    // Place in the new slot (move existing back to pool)
    if (slot === "left") {
      setQ5LeftSlot(q5DragValue);
    } else {
      setQ5RightSlot(q5DragValue);
    }

    setQ5DragSource(null);
    setQ5DragValue(null);
  };

  const handleQ5DropOnPool = () => {
    if (q5DragValue === null) return;
    if (q5DragSource === "left") setQ5LeftSlot(null);
    if (q5DragSource === "right") setQ5RightSlot(null);
    setQ5DragSource(null);
    setQ5DragValue(null);
  };

  // Touch-based drag for mobile
  const [touchDrag, setTouchDrag] = useState<{
    value: number;
    source: "pool" | "left" | "right";
  } | null>(null);

  const handleTapCard = (value: number, source: "pool" | "left" | "right") => {
    if (showSuccess || showHint) return;
    if (touchDrag && touchDrag.value === value && touchDrag.source === source) {
      // Deselect
      setTouchDrag(null);
    } else {
      setTouchDrag({ value, source });
    }
  };

  const handleTapSlot = (slot: "left" | "right") => {
    if (!touchDrag) return;
    // Remove from the old slot
    if (touchDrag.source === "left") setQ5LeftSlot(null);
    if (touchDrag.source === "right") setQ5RightSlot(null);

    if (slot === "left") setQ5LeftSlot(touchDrag.value);
    else setQ5RightSlot(touchDrag.value);

    setTouchDrag(null);
  };

  const handleTapPool = () => {
    if (!touchDrag) return;
    if (touchDrag.source === "left") setQ5LeftSlot(null);
    if (touchDrag.source === "right") setQ5RightSlot(null);
    setTouchDrag(null);
  };

  const checkQ5 = () => {
    if (showSuccess || showHint) return;
    if (q5LeftSlot === null || q5RightSlot === null) return;

    const target = q5Config.target;
    const minBranch = Math.min(q5LeftSlot, q5RightSlot);
    // Correct if one branch == target AND the other >= target
    const isCorrect =
      (q5LeftSlot === target && q5RightSlot >= target) ||
      (q5RightSlot === target && q5LeftSlot >= target);

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      const hintText = t(`b4test.q${currentQ}.hint`);
      const delay = 1500 + hintText.length * 40 + 2000;
      handleWrongAnswer();
      setTimeout(() => {
        setQ5LeftSlot(null);
        setQ5RightSlot(null);
      }, delay);
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
            {t("b4test.complete.title")}
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
              🏅 {t("b4test.complete.badge")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <DandySpeechBubble text={t("b4test.complete.dandy")} />
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
              {t("b4test.complete.back")}
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
                setQ1Selected(null);
                setQ2Selected(null);
                setQ3Selected(null);
                setQ4Selected(null);
                setQ5LeftSlot(null);
                setQ5RightSlot(null);
              }}
              disabled={isTyping}
            >
              {t("b4test.complete.retry")}
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const getMascotText = () => {
    if (showSuccess) return t(`b4test.q${currentQ}.correct`);
    if (showHint) return t(`b4test.q${currentQ}.hint`);
    return null;
  };

  const mascotText = getMascotText();

  const resetQuestion = (q: number) => {
    if (q === 1) setQ1Selected(null);
    if (q === 2) setQ2Selected(null);
    if (q === 3) setQ3Selected(null);
    if (q === 4) setQ4Selected(null);
    if (q === 5) { setQ5LeftSlot(null); setQ5RightSlot(null); setTouchDrag(null); }
  };

  const handleBackQuestion = () => {
    if (showSuccess || showHint) return;
    if (currentQ > 1) {
      setScore((s) => Math.max(s - 1, 0));
      setShowHint(false);
      setShowSuccess(false);
      resetQuestion(currentQ);
      resetQuestion(currentQ - 1);
      setCurrentQ((q) => q - 1);
    } else if (onBack) {
      onBack();
    }
  };

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
                if (key === "nav.step") return t("b4test.question");
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
          {t("b4test.title")}
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
          {currentQ === 1 && (
            <Question1
              t={t}
              options={q1Options}
              selected={q1Selected}
              onSelect={handleQ1}
              showSuccess={showSuccess}
            />
          )}
          {currentQ === 2 && (
            <Question2
              t={t}
              variant={q2Variant}
              options={q2Options}
              selected={q2Selected}
              onSelect={handleQ2}
              showSuccess={showSuccess}
            />
          )}
          {currentQ === 3 && (
            <Question3
              t={t}
              config={q3Config}
              options={q3Options}
              selected={q3Selected}
              onSelect={handleQ3}
              showSuccess={showSuccess}
            />
          )}
          {currentQ === 4 && (
            <Question4
              t={t}
              selected={q4Selected}
              onSelect={handleQ4}
              showSuccess={showSuccess}
            />
          )}
          {currentQ === 5 && (
            <Question5
              t={t}
              config={q5Config}
              leftSlot={q5LeftSlot}
              rightSlot={q5RightSlot}
              available={q5AvailableNumbers}
              touchDrag={touchDrag}
              onDragStart={handleQ5DragStart}
              onDropSlot={handleQ5DropOnSlot}
              onDropPool={handleQ5DropOnPool}
              onTapCard={handleTapCard}
              onTapSlot={handleTapSlot}
              onTapPool={handleTapPool}
              onCheck={checkQ5}
              showSuccess={showSuccess}
              showHint={showHint}
            />
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
          disabled={showSuccess || showHint}
        >
          <ChevronLeft className="w-4 h-4" />
          {t("nav.back")}
        </button>
      </div>
    </div>
  );
};

// ==================== QUESTION COMPONENTS ====================

// ─── Q1: Activation of binary bonus ───
function Question1({
  t,
  options,
  selected,
  onSelect,
  showSuccess,
}: {
  t: (k: string) => string;
  options: { id: string; textKey: string }[];
  selected: string | null;
  onSelect: (v: string) => void;
  showSuccess: boolean;
}) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
        {t("b4test.q1.title")}
      </h2>
      <InstructionCard
        text={t("b4test.q1.instruction")}
        active={!selected}
        icon="🎯"
        className="mb-4"
      />
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all active:scale-[0.98] ${
              selected === opt.id
                ? opt.id === "b" && showSuccess
                  ? "border-green-500 bg-green-500/10"
                  : "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/30 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-lg hover:z-10"
            }`}
            onClick={() => onSelect(opt.id)}
          >
            <span className="text-base font-semibold text-foreground">
              {t(opt.textKey)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Q2: Binary bonus percentage ───
function Question2({
  t,
  variant,
  options,
  selected,
  onSelect,
  showSuccess,
}: {
  t: (k: string) => string;
  variant: Task2Variant;
  options: string[];
  selected: string | null;
  onSelect: (v: string) => void;
  showSuccess: boolean;
}) {
  const correctAnswer = variant === "A" ? "6" : variant === "B" ? "10" : "8";
  const titleKey =
    variant === "A" ? "b4test.q2.titleA" : variant === "B" ? "b4test.q2.titleB" : "b4test.q2.titleC";

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
        {t(titleKey)}
      </h2>
      <InstructionCard
        text={t("b4test.q2.instruction")}
        active={!selected}
        icon="🎯"
        className="mb-4"
      />
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt}
            className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all active:scale-[0.98] ${
              selected === opt
                ? opt === correctAnswer && showSuccess
                  ? "border-green-500 bg-green-500/10"
                  : "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/30 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-lg hover:z-10"
            }`}
            onClick={() => onSelect(opt)}
          >
            <span className="text-base font-semibold text-foreground">
              {opt}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Q3: Payout limit per package ───
function Question3({
  t,
  config,
  options,
  selected,
  onSelect,
  showSuccess,
}: {
  t: (k: string) => string;
  config: Task3Config;
  options: string[];
  selected: string | null;
  onSelect: (v: string) => void;
  showSuccess: boolean;
}) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
        <HighlightVip text={t(`b4test.q3.title.${config.packageKey}`)} />
      </h2>
      <InstructionCard
        text={t("b4test.q3.instruction")}
        active={!selected}
        icon="🎯"
        className="mb-4"
      />
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt}
            className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all active:scale-[0.98] ${
              selected === opt
                ? opt === config.correctPV && showSuccess
                  ? "border-green-500 bg-green-500/10"
                  : "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/30 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-lg hover:z-10"
            }`}
            onClick={() => onSelect(opt)}
          >
            <span className="text-base font-semibold text-foreground">
              {opt} PV
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Q4: Visual selection – partner placement ───
function Question4({
  t,
  selected,
  onSelect,
  showSuccess,
}: {
  t: (k: string) => string;
  selected: number | null;
  onSelect: (idx: number) => void;
  showSuccess: boolean;
}) {
  // Image configs: [leftCount, rightCount]
  const configs: [number, number][] = [
    [1, 1], // Image 1
    [2, 1], // Image 2
    [1, 2], // Image 3 — correct
    [0, 3], // Image 4
  ];

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
        {t("b4test.q4.title")}
      </h2>
      <InstructionCard
        text={t("b4test.q4.instruction")}
        active={selected === null}
        icon="🎯"
        className="mb-4"
      />
      <div className="grid grid-cols-2 gap-3">
        {configs.map(([left, right], idx) => {
          const isSelected = selected === idx;
          const isCorrect = idx === 2;
          return (
            <button
              key={idx}
              className={`relative p-3 sm:p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                isSelected
                  ? isCorrect && showSuccess
                    ? "border-green-500 bg-green-500/10"
                    : "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/30 hover:shadow-lg"
              }`}
              onClick={() => onSelect(idx)}
            >
              <MiniTreeDiagram t={t} leftCount={left} rightCount={right} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mini tree diagram for Q4 ───
function MiniTreeDiagram({
  t,
  leftCount,
  rightCount,
}: {
  t: (k: string) => string;
  leftCount: number;
  rightCount: number;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      {/* You node */}
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
          <PersonIcon color="hsl(var(--primary))" size={18} />
        </div>
        <span className="text-[10px] font-bold text-foreground mt-0.5">
          {t("b4test.q4.you")}
        </span>
      </div>

      {/* Lines */}
      <div className="flex items-start w-full justify-center gap-0">
        <div className="flex flex-col items-center flex-1">
          <div className="w-px h-3 border-l border-dashed border-muted-foreground/50" />
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full mb-1" style={{ backgroundColor: "hsla(200, 55%, 50%, 0.12)", color: "hsl(200, 55%, 45%)" }}>
            {t("b4test.q4.left")}
          </span>
          <div className="flex flex-col gap-1 items-center min-h-[28px]">
            {Array.from({ length: leftCount }).map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-accent/30 border border-accent flex items-center justify-center"
              >
                <PersonIcon color="hsl(var(--accent))" size={14} />
              </div>
            ))}
            {leftCount === 0 && (
              <div className="w-6 h-6 rounded-full border border-dashed border-muted-foreground/30" />
            )}
          </div>
        </div>

        <div className="flex flex-col items-center flex-1">
          <div className="w-px h-3 border-l border-dashed border-muted-foreground/50" />
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full mb-1" style={{ backgroundColor: "hsla(25, 55%, 50%, 0.12)", color: "hsl(25, 55%, 45%)" }}>
            {t("b4test.q4.right")}
          </span>
          <div className="flex flex-col gap-1 items-center min-h-[28px]">
            {Array.from({ length: rightCount }).map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-accent/30 border border-accent flex items-center justify-center"
              >
                <PersonIcon color="hsl(var(--accent))" size={14} />
              </div>
            ))}
            {rightCount === 0 && (
              <div className="w-6 h-6 rounded-full border border-dashed border-muted-foreground/30" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Q5: Drag-and-drop binary bonus ───
function Question5({
  t,
  config,
  leftSlot,
  rightSlot,
  available,
  touchDrag,
  onDragStart,
  onDropSlot,
  onDropPool,
  onTapCard,
  onTapSlot,
  onTapPool,
  onCheck,
  showSuccess,
  showHint,
}: {
  t: (k: string) => string;
  config: Task5Config;
  leftSlot: number | null;
  rightSlot: number | null;
  available: number[];
  touchDrag: { value: number; source: "pool" | "left" | "right" } | null;
  onDragStart: (v: number, source: "pool" | "left" | "right") => void;
  onDropSlot: (slot: "left" | "right") => void;
  onDropPool: () => void;
  onTapCard: (v: number, source: "pool" | "left" | "right") => void;
  onTapSlot: (slot: "left" | "right") => void;
  onTapPool: () => void;
  onCheck: () => void;
  showSuccess: boolean;
  showHint: boolean;
}) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
        {t("b4test.q5.title")}
      </h2>
      <InstructionCard
        text={`${t("b4test.q5.instruction")} ${config.target} PV`}
        active={!showSuccess}
        icon="🎯"
        className="mb-4"
      />

      {/* Binary tree */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-card mb-4">
        {/* You node */}
        <div className="flex flex-col items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
            <PersonIcon color="hsl(var(--primary))" size={22} />
          </div>
          <span className="text-xs font-bold text-foreground mt-1">
            {t("b4test.q4.you")}
          </span>
        </div>

        {/* Branches */}
        <div className="flex gap-4 justify-center">
          {/* Left branch */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-px h-4 border-l border-dashed border-muted-foreground/50" />
            <span className="text-xs font-semibold text-muted-foreground mb-2">
              {t("b4test.q4.left")}
            </span>
            <div
              className={`w-full min-h-[56px] rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${
                leftSlot !== null
                  ? "border-primary bg-primary/10"
                  : touchDrag
                  ? "border-accent bg-accent/10 animate-pulse"
                  : "border-muted-foreground/30 bg-muted/30"
              }`}
              onDragOver={handleDragOver}
              onDrop={() => onDropSlot("left")}
              onClick={() =>
                leftSlot === null ? onTapSlot("left") : onTapCard(leftSlot, "left")
              }
            >
              {leftSlot !== null ? (
                <span className="text-lg font-bold text-primary">
                  {leftSlot} PV
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {t("b4test.q5.dropHere")}
                </span>
              )}
            </div>
          </div>

          {/* Right branch */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-px h-4 border-l border-dashed border-muted-foreground/50" />
            <span className="text-xs font-semibold text-muted-foreground mb-2">
              {t("b4test.q4.right")}
            </span>
            <div
              className={`w-full min-h-[56px] rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${
                rightSlot !== null
                  ? "border-primary bg-primary/10"
                  : touchDrag
                  ? "border-accent bg-accent/10 animate-pulse"
                  : "border-muted-foreground/30 bg-muted/30"
              }`}
              onDragOver={handleDragOver}
              onDrop={() => onDropSlot("right")}
              onClick={() =>
                rightSlot === null ? onTapSlot("right") : onTapCard(rightSlot, "right")
              }
            >
              {rightSlot !== null ? (
                <span className="text-lg font-bold text-primary">
                  {rightSlot} PV
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {t("b4test.q5.dropHere")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cards pool */}
      <div
        className="flex flex-wrap gap-2 justify-center mb-4"
        onDragOver={handleDragOver}
        onDrop={onDropPool}
        onClick={() => {
          if (touchDrag && touchDrag.source !== "pool") onTapPool();
        }}
      >
        {available.map((num) => (
          <div
            key={num}
            draggable
            onDragStart={() => onDragStart(num, "pool")}
            onClick={(e) => {
              e.stopPropagation();
              onTapCard(num, "pool");
            }}
            className={`px-4 py-3 rounded-xl border-2 cursor-grab active:cursor-grabbing transition-all select-none ${
              touchDrag?.value === num && touchDrag.source === "pool"
                ? "border-accent bg-accent/20 scale-105 shadow-lg"
                : "border-border bg-card hover:border-primary/30 hover:shadow-md"
            }`}
          >
            <span className="text-base font-bold text-foreground">
              {num} PV
            </span>
          </div>
        ))}
      </div>

      {touchDrag && (
        <p className="text-center text-xs text-muted-foreground mb-3">
          {t("b4test.q5.tapHint")}
        </p>
      )}

      <button
        className="w-full px-6 py-3.5 rounded-full font-bold text-base gradient-primary text-primary-foreground shadow-button hover:opacity-90 active:scale-95 transition-all"
        onClick={onCheck}
        disabled={
          showSuccess ||
          showHint ||
          leftSlot === null ||
          rightSlot === null
        }
      >
        {t("b4test.check")}
      </button>
    </div>
  );
}

export default Block4Test;
