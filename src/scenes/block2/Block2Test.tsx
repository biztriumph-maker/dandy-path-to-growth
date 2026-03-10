import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import DandySpeechBubble from "../../components/DandySpeechBubble";
import InstructionCard from "../../components/InstructionCard";
import ProgressBar from "../../components/ProgressBar";
import { useDandyIsTyping } from "../../hooks/use-dandy";

interface Block2TestProps {
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

// Generate a random calendar month
function getRandomMonth() {
  const months = [
    { name: "Январь", days: 31, startDay: Math.floor(Math.random() * 7) },
    { name: "Февраль", days: 28, startDay: Math.floor(Math.random() * 7) },
    { name: "Март", days: 31, startDay: Math.floor(Math.random() * 7) },
    { name: "Апрель", days: 30, startDay: Math.floor(Math.random() * 7) },
    { name: "Май", days: 31, startDay: Math.floor(Math.random() * 7) },
    { name: "Июнь", days: 30, startDay: Math.floor(Math.random() * 7) },
    { name: "Июль", days: 31, startDay: Math.floor(Math.random() * 7) },
    { name: "Август", days: 31, startDay: Math.floor(Math.random() * 7) },
    { name: "Сентябрь", days: 30, startDay: Math.floor(Math.random() * 7) },
    { name: "Октябрь", days: 31, startDay: Math.floor(Math.random() * 7) },
    { name: "Ноябрь", days: 30, startDay: Math.floor(Math.random() * 7) },
    { name: "Декабрь", days: 31, startDay: Math.floor(Math.random() * 7) },
  ];
  return months[Math.floor(Math.random() * months.length)];
}

// Packages data for Q5
const packagesData = [
  { name: "Клиент", nameEn: "client", pv: "60", products: "1", discount: "0%" },
  { name: "Партнёр", nameEn: "partner", pv: "120", products: "2", discount: "0%" },
  { name: "Бизнес", nameEn: "business", pv: "180", products: "3", discount: "0%" },
  { name: "Элит", nameEn: "elite", pv: "240", products: "4", discount: "0%" },
  { name: "VIP", nameEn: "vip", pv: "324", products: "6", discount: "10%" },
];

const TOTAL_QUESTIONS = 5;

const Block2Test = ({ t, onComplete, onBack }: Block2TestProps) => {
  const [currentQ, setCurrentQ] = useState(1);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [finished, setFinished] = useState(false);

  const isTyping = useDandyIsTyping();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const scrollable = document.querySelector('.overflow-y-auto');
    if (scrollable) scrollable.scrollTop = 0;
  }, [currentQ]);

  // Q1 state
  const [q1Options] = useState(() => shuffle(["1", "2", "3", "4"]));
  const [q1Selected, setQ1Selected] = useState<string | null>(null);

  // Q2 state - calendar
  const [calMonth] = useState(() => getRandomMonth());
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [q2TargetPeriod] = useState<"first" | "second">(Math.random() > 0.5 ? "first" : "second");

  // Q3 state
  const [q3Date] = useState(() => {
    const d = Math.floor(Math.random() * 28) + 1;
    return d;
  });
  const [q3Options] = useState(() => shuffle(["первый", "второй"]));
  const [q3Selected, setQ3Selected] = useState<string | null>(null);

  // Q4 state
  const [q4Options] = useState(() =>
    shuffle([
      { id: "buy", label: t("test.q4.opt1") },
      { id: "docs", label: t("test.q4.opt2") },
      { id: "invite", label: t("test.q4.opt3") },
      { id: "withdraw", label: t("test.q4.opt4") },
    ])
  );
  const [q4Selected, setQ4Selected] = useState<string[]>([]);

  // Q5 state - table
  const [q5Rows] = useState(() => {
    // Generate an array of columns to hide so they don't repeat heavily
    const allFields = ["name", "pv", "products", "discount"];
    // Shuffle the 4 columns, then pick 1 extra random column for the 5th row
    const hides = shuffle([...allFields, allFields[Math.floor(Math.random() * allFields.length)]]);

    // Shuffle the packages so they appear in a random order, increasing replay value
    const shuffledPackages = shuffle(packagesData);

    return shuffledPackages.map((pkg, i) => {
      const hideField = hides[i];
      
      return {
        ...pkg,
        cluePattern: { 
          hideFields: [hideField],
          showFields: allFields.filter(f => f !== hideField)
        },
        rowIndex: i,
      };
    });
  });
  const [q5Inputs, setQ5Inputs] = useState<Record<string, string>>({});
  const [q5Correct, setQ5Correct] = useState<Record<string, boolean>>({});

  const handleWrongAnswer = useCallback(() => {
    const text = t(`test.q${currentQ}.hint`);
    const delay = 1500 + text.length * 40 + 2000;
    setShowHint(true);
    setTimeout(() => {
      setShowHint(false);
    }, delay);
  }, [currentQ, t]);

  const handleCorrectAnswer = useCallback(() => {
    const text = t(`test.q${currentQ}.correct`);
    const delay = 1500 + text.length * 40 + 1500; // 1.5s reading time after typing
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
    if (val === "2") {
      handleCorrectAnswer();
    } else {
      const hintText = t(`test.q${currentQ}.hint`);
      const delay = 1500 + hintText.length * 40 + 2000;
      handleWrongAnswer();
      setTimeout(() => setQ1Selected(null), delay);
    }
  };

  // Q2 handler - calendar selection
  const handleCalendarDay = (day: number) => {
    if (showSuccess || showHint) return;
    setSelectedDays((prev) => {
      if (prev.includes(day)) return prev.filter((d) => d !== day);
      return [...prev, day];
    });
  };

  const checkQ2 = () => {
    if (showSuccess || showHint) return;
    const sorted = [...selectedDays].sort((a, b) => a - b);
    
    if (q2TargetPeriod === "first") {
      // Check first period: 1-14
      const correct = sorted.length === 14 && sorted.every((d, i) => d === i + 1);
      if (correct) {
        handleCorrectAnswer();
      } else {
        const hintText = t(`test.q${currentQ}.hint`);
        const delay = 1500 + hintText.length * 40 + 2000;
        handleWrongAnswer();
        setTimeout(() => setSelectedDays([]), delay);
      }
    } else {
      // Check second period: 15-end
      const correct =
        sorted.length === calMonth.days - 14 &&
        sorted.every((d, i) => d === 15 + i);
      if (correct) {
        handleCorrectAnswer();
      } else {
        const hintText = t(`test.q${currentQ}.hint`);
        const delay = 1500 + hintText.length * 40 + 2000;
        handleWrongAnswer();
        setTimeout(() => setSelectedDays([]), delay);
      }
    }
  };

  // Q3 handler
  const handleQ3 = (val: string) => {
    if (showSuccess || showHint) return;
    setQ3Selected(val);
    const correctPeriod = q3Date <= 14 ? "первый" : "второй";
    if (val === correctPeriod) {
      handleCorrectAnswer();
    } else {
      const hintText = t(`test.q${currentQ}.hint`);
      const delay = 1500 + hintText.length * 40 + 2000;
      handleWrongAnswer();
      setTimeout(() => setQ3Selected(null), delay);
    }
  };

  // Q4 handler
  const handleQ4Toggle = (id: string) => {
    if (showSuccess || showHint) return;
    setQ4Selected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const checkQ4 = () => {
    if (showSuccess || showHint) return;
    const correct =
      q4Selected.length === 2 &&
      q4Selected.includes("docs") &&
      q4Selected.includes("withdraw");
    if (correct) {
      handleCorrectAnswer();
    } else {
      const hintText = t(`test.q${currentQ}.hint`);
      const delay = 1500 + hintText.length * 40 + 2000;
      handleWrongAnswer();
      setTimeout(() => {
        // Keep correct selections, remove incorrect
        setQ4Selected((prev) =>
          prev.filter((id) => id === "docs" || id === "withdraw")
        );
      }, delay);
    }
  };

  // Q5 handler
  const handleQ5Input = (key: string, value: string) => {
    setQ5Inputs((prev) => ({ ...prev, [key]: value }));
  };

  const nameVariants: Record<string, string[]> = {
    "Клиент": ["клиент", "client", "klient", "клієнт", "mijoz"],
    "Партнёр": ["партнёр", "партнер", "partner", "hamkor", "серіктес"],
    "Бизнес": ["бизнес", "business", "biznes"],
    "Элит": ["элит", "elite", "elit"],
    "VIP": ["vip", "вип", "вiп"],
  };

  const checkQ5 = () => {
    if (showSuccess || showHint) return;
    let allCorrect = true;
    const newCorrect: Record<string, boolean> = {};

    q5Rows.forEach((row) => {
      row.cluePattern.hideFields.forEach((field) => {
        const key = `${row.rowIndex}-${field}`;
        const input = (q5Inputs[key] || "").trim().toLowerCase();
        let correct = false;

        if (field === "name") {
          const variants = nameVariants[row.name] || [row.name.toLowerCase()];
          correct = variants.includes(input);
        } else if (field === "pv") {
          correct = input === row.pv;
        } else if (field === "products") {
          correct = input === row.products;
        } else if (field === "discount") {
          if (row.name !== "VIP") {
            // Empty discount requires explicit input - not auto-correct
            correct = input !== "" && (input === "0" || input === "0%" || input === "нет" || input === "—" || input === "-" || input === "нет скидки");
          } else {
            correct = input === "10%" || input === "10";
          }
        }

        newCorrect[key] = correct;
        if (!correct) allCorrect = false;
      });
    });

    setQ5Correct(newCorrect);

    if (allCorrect) {
      handleCorrectAnswer();
    } else {
      const hintText = t(`test.q${currentQ}.hint`);
      const delay = 1500 + hintText.length * 40 + 2000;
      handleWrongAnswer();
      // Clear incorrect inputs after delay
      setTimeout(() => {
        setQ5Inputs((prev) => {
          const next = { ...prev };
          Object.entries(newCorrect).forEach(([key, isCorrect]) => {
            if (!isCorrect) delete next[key];
          });
          return next;
        });
        setQ5Correct((prev) => {
          const next = { ...prev };
          Object.entries(newCorrect).forEach(([key, isCorrect]) => {
            if (!isCorrect) delete next[key];
          });
          return next;
        });
      }, delay);
    }
  };

  // FINAL SCREEN
  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-6 sm:py-8 text-center gradient-hero">
        <motion.div
          className="space-y-6 max-w-sm sm:max-w-md w-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Big celebration icon */}
          <motion.div
            className="text-8xl mb-2"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            🏆
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {t("test.complete.title")}
          </h2>

          {/* Score card - big and prominent */}
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
              🏅 {t("test.complete.badge")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <DandySpeechBubble text={t("test.complete.dandy")} />
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
              {t("test.complete.back")}
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
                setSelectedDays([]);
                setQ3Selected(null);
                setQ4Selected([]);
                setQ5Inputs({});
                setQ5Correct({});
              }}
              disabled={isTyping}
            >
              {t("test.complete.retry")}
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const getMascotText = () => {
    if (showSuccess) return t(`test.q${currentQ}.correct`);
    if (showHint) return t(`test.q${currentQ}.hint`);
    return null;
  };

  const mascotText = getMascotText();

  const handleBackQuestion = () => {
    if (showSuccess || showHint) return;
    if (currentQ > 1) {
      const prevQ = currentQ - 1;
      // Reset state of the question we're going back to
      if (prevQ === 1) {
        setQ1Selected(null);
      } else if (prevQ === 2) {
        setSelectedDays([]);
      } else if (prevQ === 3) {
        setQ3Selected(null);
      } else if (prevQ === 4) {
        setQ4Selected([]);
      } else if (prevQ === 5) {
        setQ5Inputs({});
        setQ5Correct({});
      }
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
                if (key === "nav.step") return t("test.question");
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
          {t("test.title")}
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
              month={calMonth}
              selectedDays={selectedDays}
              targetPeriod={q2TargetPeriod}
              onDayClick={handleCalendarDay}
              onCheck={checkQ2}
              showSuccess={showSuccess}
              showHint={showHint}
            />
          )}
          {currentQ === 3 && (
            <Question3
              t={t}
              date={q3Date}
              options={q3Options}
              selected={q3Selected}
              onSelect={handleQ3}
              showSuccess={showSuccess}
            />
          )}
          {currentQ === 4 && (
            <Question4
              t={t}
              options={q4Options}
              selected={q4Selected}
              onToggle={handleQ4Toggle}
              onCheck={checkQ4}
              showSuccess={showSuccess}
              showHint={showHint}
            />
          )}
          {currentQ === 5 && (
            <Question5
              t={t}
              rows={q5Rows}
              inputs={q5Inputs}
              correct={q5Correct}
              onInput={handleQ5Input}
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

// Q1
function Question1({
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
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">{t("test.q1.title")}</h2>
      <InstructionCard text={t("test.q1.instruction")} active={!selected} icon="🎯" className="mb-4" />
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt}
            className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all active:scale-[0.98] ${
              selected === opt
                ? opt === "2" && showSuccess
                  ? "border-green-500 bg-green-500/10"
                  : "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/30 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-lg hover:z-10"
            }`}
            onClick={() => onSelect(opt)}
          >
            <span className="text-base font-semibold text-foreground">{opt}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Q2
function Question2({
  t,
  month,
  selectedDays,
  targetPeriod,
  onDayClick,
  onCheck,
  showSuccess,
  showHint,
}: {
  t: (k: string) => string;
  month: { name: string; days: number; startDay: number };
  selectedDays: number[];
  targetPeriod: "first" | "second";
  onDayClick: (d: number) => void;
  onCheck: () => void;
  showSuccess: boolean;
  showHint: boolean;
}) {
  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const cells: (number | null)[] = [];
  for (let i = 0; i < month.startDay; i++) cells.push(null);
  for (let d = 1; d <= month.days; d++) cells.push(d);

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">{t("test.q2.title")}</h2>
      <InstructionCard
        text={targetPeriod === "first" ? t("test.q2.selectPeriod1") : t("test.q2.selectPeriod2")}
        active={!showSuccess}
        icon="🎯"
        className="mb-3"
      />

      {/* Calendar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-card border border-border shadow-card mb-4">
        <p className="text-center font-bold text-foreground mb-2 sm:text-lg">{month.name}</p>
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
          {weekDays.map((d) => (
            <span key={d} className="text-xs sm:text-sm font-semibold text-muted-foreground py-1">
              {d}
            </span>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <span key={`e-${i}`} />;
            const isSelected = selectedDays.includes(day);
            return (
              <button
                key={day}
                className={`w-full aspect-square rounded-lg text-xs sm:text-sm font-semibold transition-all active:scale-90 ${
                  isSelected
                    ? targetPeriod === "second"
                      ? "bg-green-300/40 text-foreground border border-green-400/50"
                      : "bg-yellow-300/40 text-foreground border border-yellow-400/50"
                    : "bg-background text-foreground hover:bg-muted"
                }`}
                onClick={() => onDayClick(day)}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <button
        className="w-full px-6 py-3.5 rounded-full font-bold text-base gradient-primary text-primary-foreground shadow-button hover:opacity-90 active:scale-95 transition-all"
        onClick={onCheck}
        disabled={showSuccess || showHint}
      >
        {t("test.check")}
      </button>
    </div>
  );
}

// Q3
function Question3({
  t,
  date,
  options,
  selected,
  onSelect,
  showSuccess,
}: {
  t: (k: string) => string;
  date: number;
  options: string[];
  selected: string | null;
  onSelect: (v: string) => void;
  showSuccess: boolean;
}) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
        {date} {t("test.q3.title")}
      </h2>
      <InstructionCard text={t("test.q3.instruction")} active={!selected} icon="🎯" className="mb-4" />
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${
              selected === opt
                ? showSuccess
                  ? "border-green-500 bg-green-500/10"
                  : "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/30 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-lg hover:z-10"
            }`}
            onClick={() => onSelect(opt)}
          >
            <span className="text-base font-semibold text-foreground">{opt}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Q4
function Question4({
  t,
  options,
  selected,
  onToggle,
  onCheck,
  showSuccess,
  showHint,
}: {
  t: (k: string) => string;
  options: { id: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  onCheck: () => void;
  showSuccess: boolean;
  showHint: boolean;
}) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">{t("test.q4.title")}</h2>
      <InstructionCard text={t("test.q4.instruction")} active={selected.length === 0} icon="🎯" className="mb-4" />
      <div className="space-y-2 mb-4">
        {options.map(({ id, label }) => (
          <button
            key={id}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all active:scale-[0.98] flex items-center gap-3 ${
              selected.includes(id)
                ? showSuccess && (id === "docs" || id === "withdraw")
                  ? "border-green-500 bg-green-500/10"
                  : "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/30 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-lg hover:z-10"
            }`}
            onClick={() => onToggle(id)}
          >
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                selected.includes(id)
                  ? "border-primary bg-primary"
                  : "border-muted-foreground"
              }`}
            >
              {selected.includes(id) && (
                <span className="text-primary-foreground text-xs font-bold">✓</span>
              )}
            </div>
            <span className="text-base font-medium text-foreground">{label}</span>
          </button>
        ))}
      </div>
      <button
        className="w-full px-6 py-3.5 rounded-full font-bold text-base gradient-primary text-primary-foreground shadow-button hover:opacity-90 active:scale-95 transition-all"
        onClick={onCheck}
        disabled={showSuccess || showHint || selected.length === 0}
      >
        {t("test.check")}
      </button>
    </div>
  );
}

// Q5
function Question5({
  t,
  rows,
  inputs,
  correct,
  onInput,
  onCheck,
  showSuccess,
  showHint,
}: {
  t: (k: string) => string;
  rows: any[];
  inputs: Record<string, string>;
  correct: Record<string, boolean>;
  onInput: (key: string, val: string) => void;
  onCheck: () => void;
  showSuccess: boolean;
  showHint: boolean;
}) {
  const headers = [t("test.q5.col.name"), t("test.q5.col.pv"), t("test.q5.col.products"), t("test.q5.col.discount")];

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">{t("test.q5.title")}</h2>
      <InstructionCard text={t("test.q5.instruction")} active={!showSuccess} icon="🎯" className="mb-4" />

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card mb-4">
        <table className="w-full text-sm sm:text-base">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {headers.map((h) => (
                <th key={h} className="px-2 sm:px-3 py-2 sm:py-3 text-left font-semibold text-foreground text-xs sm:text-sm">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const fields = ["name", "pv", "products", "discount"] as const;
              return (
                <tr key={row.rowIndex} className="border-b border-border/50">
                  {fields.map((field) => {
                    const key = `${row.rowIndex}-${field}`;
                    const isClue = row.cluePattern.showField === field;
                    const isHidden = row.cluePattern.hideFields.includes(field);
                    const val = field === "name" ? row.name : field === "pv" ? row.pv : field === "products" ? row.products : (row.discount || "—");
                    const isCorrectField = correct[key];

                    if (isClue) {
                      return (
                        <td key={field} className="px-2 sm:px-3 py-2 sm:py-3 font-medium text-foreground text-xs sm:text-sm">
                          {val}
                        </td>
                      );
                    }
                    if (isHidden) {
                      return (
                        <td key={field} className="px-1 sm:px-2 py-1 sm:py-1.5">
                          <input
                            className={`w-full px-2 py-1.5 sm:py-2 rounded-lg border text-xs sm:text-sm transition-colors ${
                              isCorrectField === true
                                ? "border-green-500 bg-green-500/10 text-foreground"
                                : isCorrectField === false
                                ? "border-red-500 bg-red-500/15 text-foreground outline-none ring-2 ring-red-500/20"
                                : "border-border bg-background text-foreground"
                            }`}
                            value={inputs[key] || ""}
                            onChange={(e) => onInput(key, e.target.value)}
                            disabled={isCorrectField === true || showSuccess}
                            placeholder="..."
                          />
                        </td>
                      );
                    }
                    return (
                      <td key={field} className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-foreground">
                        {val}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        className="w-full px-6 py-3.5 rounded-full font-bold text-base gradient-primary text-primary-foreground shadow-button hover:opacity-90 active:scale-95 transition-all"
        onClick={onCheck}
        disabled={showSuccess || showHint}
      >
        {t("test.check")}
      </button>
    </div>
  );
}

export default Block2Test;

