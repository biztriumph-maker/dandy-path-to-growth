import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DandySpeechBubble from "../components/DandySpeechBubble";
import InstructionCard from "../components/InstructionCard";
import { Check } from "lucide-react";

interface Scene2Props {
  onNext: () => void;
  onBack: () => void;
  selected: number | null;
  onSelect: (choice: number) => void;
  t: (key: string) => string;
}

const Scene2Participate = ({ onNext, onBack, selected, onSelect, t }: Scene2Props) => {
  const options = [
    {
      title: t("participate.opt1.title"),
      desc: t("participate.opt1.desc"),
      income: t("participate.opt1.income"),
      emoji: "🟢",
      badgeColor: "bg-muted text-muted-foreground"
    },
    {
      title: t("participate.opt2.title"),
      desc: t("participate.opt2.desc"),
      income: t("participate.opt2.income"),
      emoji: "🟡",
      badgeColor: "bg-amber-100 text-amber-800"
    },
    {
      title: t("participate.opt3.title"),
      desc: t("participate.opt3.desc"),
      income: t("participate.opt3.income"),
      emoji: "🔵",
      badgeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: t("participate.opt4.title"),
      desc: t("participate.opt4.desc"),
      income: t("participate.opt4.income"),
      extra: t("participate.opt4.extra"),
      emoji: "🟣",
      badgeColor: "bg-purple-100 text-purple-800"
    }
  ];

  return (
    <div className="flex flex-col flex-1 px-5 py-6 overflow-y-auto">
      <motion.div
        className="text-center mb-3"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t("participate.title")}
        </h2>
      </motion.div>

      <InstructionCard
        text={t("participate.subtitle")}
        active={selected === null}
        icon="🎯"
        className="mb-4"
      />

      <div className="space-y-3 mb-4">
        {options.map((opt, i) => (
          <motion.button
            key={i}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all relative ${
              selected === i
                ? "border-primary bg-primary/5 shadow-soft"
                : "border-border bg-card hover:border-primary/40 hover:shadow-lg hover:z-10"
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.4 }}
            whileHover={selected !== i ? { scale: 1.03, y: -8 } : {}}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(i)}
          >
            {selected === i && (
              <motion.div
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Check className="w-4 h-4 text-primary-foreground" />
              </motion.div>
            )}
            <div className="flex items-start gap-3 pr-8">
              <span className="text-2xl mt-0.5">{opt.emoji}</span>
              <div className="flex-1">
                <h3 className="font-bold text-foreground text-base">{opt.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{opt.desc}</p>
                {opt.extra && (
                  <p className="text-muted-foreground mt-1 text-sm">{opt.extra}</p>
                )}
                <div className={`mt-2 inline-flex flex-col items-start px-3 py-1.5 rounded-xl text-xs font-semibold ${opt.badgeColor}`}>
                  {(() => {
                    const parts = opt.income.split(/(\$[\d,.\-–+/а-яa-z]+)/gi);
                    const label = parts[0]?.trim();
                    const amounts = parts.slice(1).join('').trim();
                    return amounts ? (
                      <>
                        <span>{label}</span>
                        <span className="font-extrabold text-sm whitespace-nowrap">{amounts}</span>
                      </>
                    ) : (
                      <span>{opt.income}</span>
                    );
                  })()}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-2"
          >
            <DandySpeechBubble text={t("participate.dandy")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Scene2Participate;
