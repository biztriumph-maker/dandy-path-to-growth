import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import DandySpeechBubble from "../../components/DandySpeechBubble";
import InstructionCard from "../../components/InstructionCard";
import ProgressBar from "../../components/ProgressBar";
import { useDandyIsTyping } from "../../hooks/use-dandy";

interface Block5TestProps {
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

// ─── Task 1 config: statuses & packages ───
const ALL_STATUSES = [
  "manager", "mentor", "master", "advisor", "director",
  "superdirector", "consul", "ambassador", "president",
];
const ALL_PACKAGES = ["client", "partner", "business", "elite", "vip"];

function generateQ1() {
  const statuses = shuffle(ALL_STATUSES).slice(0, 3);
  const pkg = shuffle(ALL_PACKAGES)[0];
  const options = shuffle([...statuses.map((s) => ({ id: s, type: "status" as const })), { id: pkg, type: "package" as const }]);
  return { options, correctId: pkg };
}

// ─── Task 4 config: match status-bonus ───
const Q4_PAIRS = [
  { status: "mentor", bonus: "100" },
  { status: "master", bonus: "300" },
  { status: "advisor", bonus: "800" },
];

// ─── Task 5 config: career ladder ───
const CAREER_ORDER = [
  "manager", "mentor", "master", "advisor", "director",
  "superdirector", "consul", "ambassador", "president",
];

// ─── Main component ───
const Block5Test = ({ t, onComplete, onBack }: Block5TestProps) => {
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
  const [q1Config, setQ1Config] = useState(generateQ1);
  const [q1Selected, setQ1Selected] = useState<string | null>(null);

  // ─── Q2 state ───
  const [q2Options, setQ2Options] = useState(() => shuffle(["mentor", "manager", "master", "advisor"]));
  const [q2Selected, setQ2Selected] = useState<string | null>(null);

  // ─── Q3 state ───
  const [q3Options, setQ3Options] = useState(() => shuffle(["1", "2", "3", "6"]));
  const [q3Selected, setQ3Selected] = useState<string | null>(null);

  // ─── Q4 state: drag-and-drop matching ───
  const [q4StatusOrder, setQ4StatusOrder] = useState(() => shuffle(Q4_PAIRS.map((p) => p.status)));
  const [q4BonusOrder, setQ4BonusOrder] = useState(() => shuffle(Q4_PAIRS.map((p) => p.bonus)));
  const [q4Matches, setQ4Matches] = useState<Record<string, string | null>>({
    mentor: null, master: null, advisor: null,
  });
  const [q4Errors, setQ4Errors] = useState<string[]>([]);
  const [q4TapSelected, setQ4TapSelected] = useState<{ bonus: string } | null>(null);

  // ─── Q5 state: career ladder ordering (slot-based) ───
  const [q5Slots, setQ5Slots] = useState<(string | null)[]>(() => Array(CAREER_ORDER.length).fill(null));
  const [q5Pool, setQ5Pool] = useState<string[]>(() => shuffle([...CAREER_ORDER]));
  const [q5Errors, setQ5Errors] = useState<number[]>([]);
  const [q5Locked, setQ5Locked] = useState<boolean[]>(() => Array(CAREER_ORDER.length).fill(false));
  const [q5Selected, setQ5Selected] = useState<string | null>(null);

  // ─── Common handlers ───
  const handleWrongAnswer = useCallback(() => {
    const key = `b5test.q${currentQ}.hint`;
    const text = t(key);
    const delay = 1500 + text.length * 40 + 2000;
    setShowHint(true);
    setTimeout(() => {
      setShowHint(false);
    }, delay);
  }, [currentQ, t]);

  const handleCorrectAnswer = useCallback(() => {
    const key = `b5test.q${currentQ}.correct`;
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
    if (id === q1Config.correctId) {
      handleCorrectAnswer();
    } else {
      const hintText = t(`b5test.q${currentQ}.hint`);
      const delay = 1500 + hintText.length * 40 + 2000;
      handleWrongAnswer();
      setTimeout(() => setQ1Selected(null), delay);
    }
  };

  // ─── Q2 handler ───
  const handleQ2 = (val: string) => {
    if (showSuccess || showHint) return;
    setQ2Selected(val);
    if (val === "manager") {
      handleCorrectAnswer();
    } else {
      const hintText = t(`b5test.q${currentQ}.hint`);
      const delay = 1500 + hintText.length * 40 + 2000;
      handleWrongAnswer();
      setTimeout(() => setQ2Selected(null), delay);
    }
  };

  // ─── Q3 handler ───
  const handleQ3 = (val: string) => {
    if (showSuccess || showHint) return;
    setQ3Selected(val);
    if (val === "3") {
      handleCorrectAnswer();
    } else {
      const hintText = t(`b5test.q${currentQ}.hint`);
      const delay = 1500 + hintText.length * 40 + 2000;
      handleWrongAnswer();
      setTimeout(() => setQ3Selected(null), delay);
    }
  };

  // ─── Q4 handlers ───
  const q4AvailableBonuses = useMemo(() => {
    const used = Object.values(q4Matches).filter(Boolean) as string[];
    return q4BonusOrder.filter((b) => !used.includes(b));
  }, [q4Matches, q4BonusOrder]);

  const handleQ4TapBonus = (bonus: string) => {
    if (showSuccess || showHint) return;
    setQ4TapSelected({ bonus });
  };

  const handleQ4TapStatus = (status: string) => {
    if (showSuccess || showHint) return;
    if (q4TapSelected) {
      // If status already has a bonus, return it to pool
      const prev = q4Matches[status];
      setQ4Matches((m) => ({ ...m, [status]: q4TapSelected.bonus }));
      setQ4TapSelected(null);
      setQ4Errors([]);
    } else {
      // If status has a bonus, remove it
      if (q4Matches[status]) {
        setQ4Matches((m) => ({ ...m, [status]: null }));
      }
    }
  };

  const checkQ4 = () => {
    if (showSuccess || showHint) return;
    const allFilled = Object.values(q4Matches).every(Boolean);
    if (!allFilled) return;

    const errors: string[] = [];
    Q4_PAIRS.forEach(({ status, bonus }) => {
      if (q4Matches[status] !== bonus) errors.push(status);
    });

    if (errors.length === 0) {
      handleCorrectAnswer();
    } else {
      setQ4Errors(errors);
      const hintText = t(`b5test.q${currentQ}.hint`);
      const delay = 1500 + hintText.length * 40 + 2000;
      handleWrongAnswer();
      setTimeout(() => {
        // Reset only errored matches
        setQ4Matches((m) => {
          const next = { ...m };
          errors.forEach((s) => { next[s] = null; });
          return next;
        });
        setQ4Errors([]);
      }, delay);
    }
  };

  // ─── Q5 handlers (slot-based) ───
  const handleQ5TapPool = (status: string) => {
    if (showSuccess || showHint) return;
    setQ5Selected((prev) => (prev === status ? null : status));
  };

  const handleQ5TapSlot = (index: number) => {
    if (showSuccess || showHint) return;
    if (q5Locked[index]) return;

    const currentInSlot = q5Slots[index];

    if (q5Selected) {
      // Place selected status into this slot
      if (currentInSlot) {
        // Return current occupant to pool
        setQ5Pool((p) => [...p, currentInSlot]);
      }
      setQ5Slots((s) => { const next = [...s]; next[index] = q5Selected; return next; });
      setQ5Pool((p) => p.filter((s) => s !== q5Selected));
      setQ5Selected(null);
    } else if (currentInSlot) {
      // Remove from slot back to pool
      setQ5Slots((s) => { const next = [...s]; next[index] = null; return next; });
      setQ5Pool((p) => [...p, currentInSlot]);
    }
  };

  const checkQ5 = () => {
    if (showSuccess || showHint) return;
    const allFilled = q5Slots.every((s) => s !== null);
    if (!allFilled) return;

    const errorIndices: number[] = [];
    const newLocked = [...q5Locked];

    q5Slots.forEach((status, i) => {
      if (status === CAREER_ORDER[i]) {
        newLocked[i] = true;
      } else {
        errorIndices.push(i);
      }
    });

    if (errorIndices.length === 0) {
      setQ5Locked(newLocked);
      handleCorrectAnswer();
    } else {
      setQ5Errors(errorIndices);
      setQ5Locked(newLocked);

      const hintText = t(`b5test.q${currentQ}.hint`);
      const delay = 1500 + hintText.length * 40 + 2000;
      handleWrongAnswer();
      setTimeout(() => {
        // Return errored statuses to pool, clear those slots
        const errorStatuses = errorIndices.map((i) => q5Slots[i]!).filter(Boolean);
        setQ5Slots((s) => {
          const next = [...s];
          errorIndices.forEach((i) => { next[i] = null; });
          return next;
        });
        setQ5Pool(shuffle(errorStatuses));
        setQ5Errors([]);
        setQ5Selected(null);
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
            {t("b5test.complete.title")}
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
              🏅 {t("b5test.complete.badge")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <DandySpeechBubble text={t("b5test.complete.dandy")} />
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
              {t("b5test.complete.back")}
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
                setQ1Config(generateQ1());
                setQ1Selected(null);
                setQ2Options(shuffle(["mentor", "manager", "master", "advisor"]));
                setQ2Selected(null);
                setQ3Options(shuffle(["1", "2", "3", "6"]));
                setQ3Selected(null);
                setQ4StatusOrder(shuffle(Q4_PAIRS.map((p) => p.status)));
                setQ4BonusOrder(shuffle(Q4_PAIRS.map((p) => p.bonus)));
                setQ4Matches({ mentor: null, master: null, advisor: null });
                setQ4Errors([]);
                setQ4TapSelected(null);
                setQ5Slots(Array(CAREER_ORDER.length).fill(null));
                setQ5Pool(shuffle([...CAREER_ORDER]));
                setQ5Errors([]);
                setQ5Locked(Array(CAREER_ORDER.length).fill(false));
                setQ5Selected(null);
              }}
              disabled={isTyping}
            >
              {t("b5test.complete.retry")}
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const getMascotText = () => {
    if (showSuccess) return t(`b5test.q${currentQ}.correct`);
    if (showHint) return t(`b5test.q${currentQ}.hint`);
    return null;
  };

  const mascotText = getMascotText();

  const resetQuestion = (q: number) => {
    switch (q) {
      case 1:
        setQ1Config(generateQ1());
        setQ1Selected(null);
        break;
      case 2:
        setQ2Options(shuffle(["mentor", "manager", "master", "advisor"]));
        setQ2Selected(null);
        break;
      case 3:
        setQ3Options(shuffle(["1", "2", "3", "6"]));
        setQ3Selected(null);
        break;
      case 4:
        setQ4StatusOrder(shuffle(Q4_PAIRS.map((p) => p.status)));
        setQ4BonusOrder(shuffle(Q4_PAIRS.map((p) => p.bonus)));
        setQ4Matches({ mentor: null, master: null, advisor: null });
        setQ4Errors([]);
        setQ4TapSelected(null);
        break;
      case 5:
        setQ5Slots(Array(CAREER_ORDER.length).fill(null));
        setQ5Pool(shuffle([...CAREER_ORDER]));
        setQ5Errors([]);
        setQ5Locked(Array(CAREER_ORDER.length).fill(false));
        setQ5Selected(null);
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
                if (key === "nav.step") return t("b5test.question");
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
          {t("b5test.title")}
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
              config={q1Config}
              selected={q1Selected}
              onSelect={handleQ1}
              showSuccess={showSuccess}
            />
          )}
          {currentQ === 2 && (
            <Question2
              t={t}
              options={q2Options}
              selected={q2Selected}
              onSelect={handleQ2}
              showSuccess={showSuccess}
            />
          )}
          {currentQ === 3 && (
            <Question3
              t={t}
              options={q3Options}
              selected={q3Selected}
              onSelect={handleQ3}
              showSuccess={showSuccess}
            />
          )}
          {currentQ === 4 && (
            <Question4
              t={t}
              statusOrder={q4StatusOrder}
              availableBonuses={q4AvailableBonuses}
              matches={q4Matches}
              errors={q4Errors}
              tapSelected={q4TapSelected}
              onTapBonus={handleQ4TapBonus}
              onTapStatus={handleQ4TapStatus}
              onCheck={checkQ4}
              showSuccess={showSuccess}
              showHint={showHint}
            />
          )}
          {currentQ === 5 && (
            <Question5
              t={t}
              slots={q5Slots}
              pool={q5Pool}
              errors={q5Errors}
              locked={q5Locked}
              selected={q5Selected}
              onTapPool={handleQ5TapPool}
              onTapSlot={handleQ5TapSlot}
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

// ─── Q1: Find the odd element ───
function Question1({
  t,
  config,
  selected,
  onSelect,
  showSuccess,
}: {
  t: (k: string) => string;
  config: ReturnType<typeof generateQ1>;
  selected: string | null;
  onSelect: (v: string) => void;
  showSuccess: boolean;
}) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
        {t("b5test.q1.title")}
      </h2>
      <InstructionCard
        text={t("b5test.q1.instruction")}
        active={!selected}
        icon="🎯"
        className="mb-4"
      />
      <div className="space-y-2">
        {config.options.map((opt) => (
          <button
            key={opt.id}
            className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all active:scale-[0.98] ${
              selected === opt.id
                ? opt.id === config.correctId && showSuccess
                  ? "border-green-500 bg-green-500/10"
                  : "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/30 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-lg hover:z-10"
            }`}
            onClick={() => onSelect(opt.id)}
          >
            <span className="text-base font-semibold text-foreground">
              {t(`b5test.q1.${opt.id}`)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Q2: First career step ───
function Question2({
  t,
  options,
  selected,
  onSelect,
  showSuccess,
}: {
  t: (k: string) => string;
  options: string[];
  selected: string | null;
  onSelect: (v: string) => void;
  showSuccess: boolean;
}) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
        {t("b5test.q2.title")}
      </h2>
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 mb-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("b5test.q2.scenario")}
        </p>
      </div>
      <InstructionCard
        text={t("b5test.q2.instruction")}
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
                ? opt === "manager" && showSuccess
                  ? "border-green-500 bg-green-500/10"
                  : "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/30 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-lg hover:z-10"
            }`}
            onClick={() => onSelect(opt)}
          >
            <span className="text-base font-semibold text-foreground">
              {t(`b5test.q2.${opt}`)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Q3: Confirm leadership status ───
function Question3({
  t,
  options,
  selected,
  onSelect,
  showSuccess,
}: {
  t: (k: string) => string;
  options: string[];
  selected: string | null;
  onSelect: (v: string) => void;
  showSuccess: boolean;
}) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
        {t("b5test.q3.title")}
      </h2>
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 mb-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("b5test.q3.scenario")}
        </p>
      </div>
      <InstructionCard
        text={t("b5test.q3.instruction")}
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
                ? opt === "3" && showSuccess
                  ? "border-green-500 bg-green-500/10"
                  : "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/30 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-lg hover:z-10"
            }`}
            onClick={() => onSelect(opt)}
          >
            <span className="text-base font-semibold text-foreground">
              {t(`b5test.q3.opt${opt}`)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Q4: Match status and bonus (tap-based) ───
function Question4({
  t,
  statusOrder,
  availableBonuses,
  matches,
  errors,
  tapSelected,
  onTapBonus,
  onTapStatus,
  onCheck,
  showSuccess,
  showHint,
}: {
  t: (k: string) => string;
  statusOrder: string[];
  availableBonuses: string[];
  matches: Record<string, string | null>;
  errors: string[];
  tapSelected: { bonus: string } | null;
  onTapBonus: (bonus: string) => void;
  onTapStatus: (status: string) => void;
  onCheck: () => void;
  showSuccess: boolean;
  showHint: boolean;
}) {
  const allFilled = Object.values(matches).every(Boolean);

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
        {t("b5test.q4.title")}
      </h2>
      <InstructionCard
        text={t("b5test.q4.instruction")}
        active={!allFilled}
        icon="🎯"
        className="mb-4"
      />

      {/* Bonus pool */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
          {t("b5test.q4.bonuses")}
        </p>
        <div className="flex flex-wrap gap-2">
          {availableBonuses.map((bonus) => (
            <button
              key={bonus}
              className={`px-4 py-2.5 rounded-xl border-2 transition-all active:scale-95 ${
                tapSelected?.bonus === bonus
                  ? "border-accent bg-accent/20 scale-105 shadow-lg"
                  : "border-border bg-card hover:border-primary/30 hover:shadow-md"
              }`}
              onClick={() => onTapBonus(bonus)}
            >
              <span className="text-base font-bold text-foreground">
                {bonus} PV
              </span>
            </button>
          ))}
        </div>
        {tapSelected && (
          <p className="text-xs text-accent mt-2">{t("b5test.q4.tapHint")}</p>
        )}
      </div>

      {/* Status slots */}
      <div className="space-y-3 mb-4">
        {statusOrder.map((status) => {
          const bonus = matches[status];
          const hasError = errors.includes(status);
          const isCorrect = bonus && Q4_PAIRS.find((p) => p.status === status)?.bonus === bonus && showSuccess;

          return (
            <div
              key={status}
              className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer active:scale-[0.98] ${
                hasError
                  ? "border-destructive bg-destructive/10"
                  : isCorrect
                  ? "border-green-500 bg-green-500/10"
                  : bonus
                  ? "border-primary bg-primary/10"
                  : tapSelected
                  ? "border-accent/50 bg-accent/5 animate-pulse"
                  : "border-border bg-card"
              }`}
              onClick={() => onTapStatus(status)}
            >
              <div className="flex-1">
                <span className="text-sm font-bold text-foreground">
                  {t(`b5test.q4.s.${status}`)}
                </span>
              </div>
              <div className="w-20 text-center">
                {bonus ? (
                  <span className="text-base font-bold text-primary">{bonus} PV</span>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="w-full px-6 py-3.5 rounded-full font-bold text-base gradient-primary text-primary-foreground shadow-button hover:opacity-90 active:scale-95 transition-all"
        onClick={onCheck}
        disabled={showSuccess || showHint || !allFilled}
      >
        {t("b5test.check")}
      </button>
    </div>
  );
}

// ─── Q5: Build the career ladder (slot-based) ───
function Question5({
  t,
  slots,
  pool,
  errors,
  locked,
  selected,
  onTapPool,
  onTapSlot,
  onCheck,
  showSuccess,
  showHint,
}: {
  t: (k: string) => string;
  slots: (string | null)[];
  pool: string[];
  errors: number[];
  locked: boolean[];
  selected: string | null;
  onTapPool: (status: string) => void;
  onTapSlot: (index: number) => void;
  onCheck: () => void;
  showSuccess: boolean;
  showHint: boolean;
}) {
  const allFilled = slots.every((s) => s !== null);

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
        {t("b5test.q5.title")}
      </h2>
      <InstructionCard
        text={t("b5test.q5.instruction")}
        active={!allFilled}
        icon="🎯"
        className="mb-4"
      />

      {/* All slots */}
      <div className="space-y-2 mb-4">
        {slots.map((status, i) => {
          const isLocked = locked[i];
          const hasError = errors.includes(i);
          const isEmpty = status === null;

          return (
            <motion.div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                hasError
                  ? "border-destructive bg-destructive/10"
                  : isLocked
                  ? "border-green-500 bg-green-500/10"
                  : isEmpty && selected
                  ? "border-accent/50 bg-accent/5 animate-pulse cursor-pointer active:scale-[0.98]"
                  : isEmpty
                  ? "border-dashed border-muted-foreground/20 bg-muted/20"
                  : "border-primary bg-primary/5 cursor-pointer active:scale-[0.98]"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => onTapSlot(i)}
            >
              <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </span>
              {status ? (
                <span className="text-sm font-semibold text-foreground flex-1">
                  {t(`b5test.q5.s.${status}`)}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground flex-1">
                  {t("b5test.q5.dropHere")}
                </span>
              )}
              {isLocked && <span className="text-green-500">✓</span>}
              {status && !isLocked && !hasError && (
                <span className="text-xs text-muted-foreground">✕</span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Pool */}
      {pool.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            {t("b5test.q5.available")}
          </p>
          <div className="flex flex-wrap gap-2">
            {pool.map((status) => (
              <button
                key={status}
                className={`px-3 py-2 rounded-xl border-2 transition-all active:scale-95 ${
                  selected === status
                    ? "border-accent bg-accent/20 scale-105 shadow-lg"
                    : "border-border bg-card hover:border-primary/30 hover:shadow-md"
                }`}
                onClick={() => onTapPool(status)}
              >
                <span className="text-sm font-semibold text-foreground">
                  {t(`b5test.q5.s.${status}`)}
                </span>
              </button>
            ))}
          </div>
          {selected && (
            <p className="text-xs text-accent mt-2">{t("b5test.q5.tapSlot")}</p>
          )}
        </div>
      )}

      <button
        className="w-full px-6 py-3.5 rounded-full font-bold text-base gradient-primary text-primary-foreground shadow-button hover:opacity-90 active:scale-95 transition-all"
        onClick={onCheck}
        disabled={showSuccess || showHint || !allFilled}
      >
        {t("b5test.check")}
      </button>
    </div>
  );
}

export default Block5Test;
