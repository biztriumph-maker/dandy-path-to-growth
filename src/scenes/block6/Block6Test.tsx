import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import DandySpeechBubble from "../../components/DandySpeechBubble";
import InstructionCard from "../../components/InstructionCard";
import ProgressBar from "../../components/ProgressBar";
import { useDandyIsTyping } from "../../hooks/use-dandy";

interface Block6TestProps {
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

const TOTAL_QUESTIONS = 4;

// ─── Q1 config: what is matching bonus source ───
const Q1_OPTIONS = ["binary", "personal", "status", "cashback"];
const Q1_CORRECT = "binary";

// ─── Q2 config: proportion ratio ───
const Q2_OPTIONS = ["1to3", "1to5", "1to10", "1to2"];
const Q2_CORRECT = "1to5";

// ─── Q3 config: match status -> level count (for Elite/VIP package) ───
const Q3_PAIRS = [
  { status: "mentor", levels: "1" },
  { status: "master", levels: "2" },
  { status: "advisor", levels: "3" },
];

// ─── Q4 config: match package -> percentage at mentor level ───
const Q4_OPTIONS = ["5", "7.5", "10", "2.5"];
const Q4_CORRECT = "5";

const Block6Test = ({ t, onComplete, onBack }: Block6TestProps) => {
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
  const [q1Options, setQ1Options] = useState(() => shuffle([...Q1_OPTIONS]));
  const [q1Selected, setQ1Selected] = useState<string | null>(null);

  // ─── Q2 state ───
  const [q2Options, setQ2Options] = useState(() => shuffle([...Q2_OPTIONS]));
  const [q2Selected, setQ2Selected] = useState<string | null>(null);

  // ─── Q3 state: match status->levels ───
  const [q3StatusOrder, setQ3StatusOrder] = useState(() => shuffle(Q3_PAIRS.map((p) => p.status)));
  const [q3LevelsOrder, setQ3LevelsOrder] = useState(() => shuffle(Q3_PAIRS.map((p) => p.levels)));
  const [q3Matches, setQ3Matches] = useState<Record<string, string | null>>({
    mentor: null, master: null, advisor: null,
  });
  const [q3Errors, setQ3Errors] = useState<string[]>([]);
  const [q3TapSelected, setQ3TapSelected] = useState<{ levels: string } | null>(null);

  // ─── Q4 state ───
  const [q4Options, setQ4Options] = useState(() => shuffle([...Q4_OPTIONS]));
  const [q4Selected, setQ4Selected] = useState<string | null>(null);

  // ─── Common handlers ───
  const handleWrongAnswer = useCallback(() => {
    const key = `b6test.q${currentQ}.hint`;
    const text = t(key);
    const delay = 1500 + text.length * 40 + 2000;
    setShowHint(true);
    setTimeout(() => {
      setShowHint(false);
    }, delay);
  }, [currentQ, t]);

  const handleCorrectAnswer = useCallback(() => {
    const key = `b6test.q${currentQ}.correct`;
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
  const handleQ1 = (val: string) => {
    if (showSuccess || showHint) return;
    setQ1Selected(val);
    if (val === Q1_CORRECT) {
      handleCorrectAnswer();
    } else {
      const hintText = t(`b6test.q${currentQ}.hint`);
      const delay = 1500 + hintText.length * 40 + 2000;
      handleWrongAnswer();
      setTimeout(() => setQ1Selected(null), delay);
    }
  };

  // ─── Q2 handler ───
  const handleQ2 = (val: string) => {
    if (showSuccess || showHint) return;
    setQ2Selected(val);
    if (val === Q2_CORRECT) {
      handleCorrectAnswer();
    } else {
      const hintText = t(`b6test.q${currentQ}.hint`);
      const delay = 1500 + hintText.length * 40 + 2000;
      handleWrongAnswer();
      setTimeout(() => setQ2Selected(null), delay);
    }
  };

  // ─── Q3 handlers ───
  const q3AvailableLevels = useMemo(() => {
    const used = Object.values(q3Matches).filter(Boolean) as string[];
    return q3LevelsOrder.filter((l) => !used.includes(l));
  }, [q3Matches, q3LevelsOrder]);

  const handleQ3TapLevel = (levels: string) => {
    if (showSuccess || showHint) return;
    setQ3TapSelected({ levels });
  };

  const handleQ3TapStatus = (status: string) => {
    if (showSuccess || showHint) return;
    if (q3TapSelected) {
      setQ3Matches((m) => ({ ...m, [status]: q3TapSelected.levels }));
      setQ3TapSelected(null);
      setQ3Errors([]);
    } else {
      if (q3Matches[status]) {
        setQ3Matches((m) => ({ ...m, [status]: null }));
      }
    }
  };

  const checkQ3 = () => {
    if (showSuccess || showHint) return;
    const allFilled = Object.values(q3Matches).every(Boolean);
    if (!allFilled) return;

    const errors: string[] = [];
    Q3_PAIRS.forEach(({ status, levels }) => {
      if (q3Matches[status] !== levels) errors.push(status);
    });

    if (errors.length === 0) {
      handleCorrectAnswer();
    } else {
      setQ3Errors(errors);
      const hintText = t(`b6test.q${currentQ}.hint`);
      const delay = 1500 + hintText.length * 40 + 2000;
      handleWrongAnswer();
      setTimeout(() => {
        setQ3Matches((m) => {
          const next = { ...m };
          errors.forEach((s) => { next[s] = null; });
          return next;
        });
        setQ3Errors([]);
      }, delay);
    }
  };

  // ─── Q4 handler ───
  const handleQ4 = (val: string) => {
    if (showSuccess || showHint) return;
    setQ4Selected(val);
    if (val === Q4_CORRECT) {
      handleCorrectAnswer();
    } else {
      const hintText = t(`b6test.q${currentQ}.hint`);
      const delay = 1500 + hintText.length * 40 + 2000;
      handleWrongAnswer();
      setTimeout(() => setQ4Selected(null), delay);
    }
  };

  // ─── Reset question on back ───
  const resetQuestion = (q: number) => {
    switch (q) {
      case 1:
        setQ1Options(shuffle([...Q1_OPTIONS]));
        setQ1Selected(null);
        break;
      case 2:
        setQ2Options(shuffle([...Q2_OPTIONS]));
        setQ2Selected(null);
        break;
      case 3:
        setQ3StatusOrder(shuffle(Q3_PAIRS.map((p) => p.status)));
        setQ3LevelsOrder(shuffle(Q3_PAIRS.map((p) => p.levels)));
        setQ3Matches({ mentor: null, master: null, advisor: null });
        setQ3Errors([]);
        setQ3TapSelected(null);
        break;
      case 4:
        setQ4Options(shuffle([...Q4_OPTIONS]));
        setQ4Selected(null);
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
            {t("b6test.complete.title")}
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
              🏅 {t("b6test.complete.badge")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <DandySpeechBubble text={t("b6test.complete.dandy")} />
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
              {t("b6test.complete.back")}
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
                setQ1Options(shuffle([...Q1_OPTIONS]));
                setQ1Selected(null);
                setQ2Options(shuffle([...Q2_OPTIONS]));
                setQ2Selected(null);
                setQ3StatusOrder(shuffle(Q3_PAIRS.map((p) => p.status)));
                setQ3LevelsOrder(shuffle(Q3_PAIRS.map((p) => p.levels)));
                setQ3Matches({ mentor: null, master: null, advisor: null });
                setQ3Errors([]);
                setQ3TapSelected(null);
                setQ4Options(shuffle([...Q4_OPTIONS]));
                setQ4Selected(null);
              }}
              disabled={isTyping}
            >
              {t("b6test.complete.retry")}
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const getMascotText = () => {
    if (showSuccess) return t(`b6test.q${currentQ}.correct`);
    if (showHint) return t(`b6test.q${currentQ}.hint`);
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
                if (key === "nav.step") return t("b6test.question");
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
          {t("b6test.title")}
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
            <Question1 t={t} options={q1Options} selected={q1Selected} onSelect={handleQ1} showSuccess={showSuccess} />
          )}
          {currentQ === 2 && (
            <Question2 t={t} options={q2Options} selected={q2Selected} onSelect={handleQ2} showSuccess={showSuccess} />
          )}
          {currentQ === 3 && (
            <Question3
              t={t}
              statusOrder={q3StatusOrder}
              availableLevels={q3AvailableLevels}
              matches={q3Matches}
              errors={q3Errors}
              tapSelected={q3TapSelected}
              onTapLevel={handleQ3TapLevel}
              onTapStatus={handleQ3TapStatus}
              onCheck={checkQ3}
              showSuccess={showSuccess}
              showHint={showHint}
            />
          )}
          {currentQ === 4 && (
            <Question4 t={t} options={q4Options} selected={q4Selected} onSelect={handleQ4} showSuccess={showSuccess} />
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

          <AnimatePresence>
            {showHint && (
              <motion.div className="flex justify-center mt-4" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
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

function Question1({ t, options, selected, onSelect, showSuccess }: {
  t: (k: string) => string; options: string[]; selected: string | null;
  onSelect: (v: string) => void; showSuccess: boolean;
}) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">{t("b6test.q1.title")}</h2>
      <InstructionCard text={t("b6test.q1.instruction")} active={!selected} icon="🎯" className="mb-4" />
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt}
            className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all active:scale-[0.98] ${
              selected === opt
                ? opt === Q1_CORRECT && showSuccess
                  ? "border-green-500 bg-green-500/10"
                  : "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/30 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-lg hover:z-10"
            }`}
            onClick={() => onSelect(opt)}
          >
            <span className="text-base font-semibold text-foreground">{t(`b6test.q1.${opt}`)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Question2({ t, options, selected, onSelect, showSuccess }: {
  t: (k: string) => string; options: string[]; selected: string | null;
  onSelect: (v: string) => void; showSuccess: boolean;
}) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">{t("b6test.q2.title")}</h2>
      <InstructionCard text={t("b6test.q2.instruction")} active={!selected} icon="🎯" className="mb-4" />
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt}
            className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all active:scale-[0.98] ${
              selected === opt
                ? opt === Q2_CORRECT && showSuccess
                  ? "border-green-500 bg-green-500/10"
                  : "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/30 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-lg hover:z-10"
            }`}
            onClick={() => onSelect(opt)}
          >
            <span className="text-base font-semibold text-foreground">{t(`b6test.q2.${opt}`)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Question3({ t, statusOrder, availableLevels, matches, errors, tapSelected, onTapLevel, onTapStatus, onCheck, showSuccess, showHint }: {
  t: (k: string) => string; statusOrder: string[]; availableLevels: string[];
  matches: Record<string, string | null>; errors: string[];
  tapSelected: { levels: string } | null;
  onTapLevel: (l: string) => void; onTapStatus: (s: string) => void;
  onCheck: () => void; showSuccess: boolean; showHint: boolean;
}) {
  const allFilled = Object.values(matches).every(Boolean);

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">{t("b6test.q3.title")}</h2>
      <InstructionCard text={t("b6test.q3.instruction")} active={!allFilled} icon="🎯" className="mb-4" />

      {/* Level pool */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{t("b6test.q3.levels")}</p>
        <div className="flex flex-wrap gap-2">
          {availableLevels.map((lvl) => (
            <button
              key={lvl}
              className={`px-4 py-2.5 rounded-xl border-2 transition-all active:scale-95 ${
                tapSelected?.levels === lvl
                  ? "border-accent bg-accent/20 scale-105 shadow-lg"
                  : "border-border bg-card hover:border-primary/30 hover:shadow-md"
              }`}
              onClick={() => onTapLevel(lvl)}
            >
              <span className="text-base font-bold text-foreground">{lvl} {t("b6test.q3.levelWord")}</span>
            </button>
          ))}
        </div>
        {tapSelected && (
          <p className="text-xs text-accent mt-2">{t("b6test.q3.tapHint")}</p>
        )}
      </div>

      {/* Status slots */}
      <div className="space-y-3 mb-4">
        {statusOrder.map((st) => {
          const lvl = matches[st];
          const hasError = errors.includes(st);
          const isCorrect = lvl && Q3_PAIRS.find((p) => p.status === st)?.levels === lvl && showSuccess;

          return (
            <div
              key={st}
              className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer active:scale-[0.98] ${
                hasError
                  ? "border-destructive bg-destructive/10"
                  : isCorrect
                  ? "border-green-500 bg-green-500/10"
                  : lvl
                  ? "border-primary bg-primary/10"
                  : tapSelected
                  ? "border-accent/50 bg-accent/5 animate-pulse"
                  : "border-border bg-card"
              }`}
              onClick={() => onTapStatus(st)}
            >
              <div className="flex-1">
                <span className="text-sm font-bold text-foreground">{t(`b6test.q3.s.${st}`)}</span>
              </div>
              <div className="w-20 text-center">
                {lvl ? (
                  <span className="text-base font-bold text-primary">{lvl} {t("b6test.q3.levelWord")}</span>
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
        {t("b6test.check")}
      </button>
    </div>
  );
}

function Question4({ t, options, selected, onSelect, showSuccess }: {
  t: (k: string) => string; options: string[]; selected: string | null;
  onSelect: (v: string) => void; showSuccess: boolean;
}) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">{t("b6test.q4.title")}</h2>
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 mb-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{t("b6test.q4.scenario")}</p>
      </div>
      <InstructionCard text={t("b6test.q4.instruction")} active={!selected} icon="🎯" className="mb-4" />
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt}
            className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all active:scale-[0.98] ${
              selected === opt
                ? opt === Q4_CORRECT && showSuccess
                  ? "border-green-500 bg-green-500/10"
                  : "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/30 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-lg hover:z-10"
            }`}
            onClick={() => onSelect(opt)}
          >
            <span className="text-base font-semibold text-foreground">{t(`b6test.q4.opt${opt}`)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Block6Test;
