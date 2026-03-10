import { motion, AnimatePresence } from "framer-motion";
import DandySpeechBubble from "../components/DandySpeechBubble";
import InstructionCard from "../components/InstructionCard";
import { Check } from "lucide-react";

interface Scene3Props {
  selected: number | null;
  onSelect: (choice: number) => void;
  t: (key: string) => string;
}

const Scene3Motivation = ({ selected, onSelect, t }: Scene3Props) => {
  const options = [
    { key: "motivation.opt1", emoji: "💰" },
    { key: "motivation.opt2", emoji: "❤️" },
    { key: "motivation.opt3", emoji: "🚀" },
    { key: "motivation.opt4", emoji: "👨‍👩‍👧‍👦" },
    { key: "motivation.opt5", emoji: "💼" },
  ];

  return (
    <div className="flex flex-col flex-1 px-5 py-6 overflow-y-auto">
      <motion.div
        className="text-center mb-3"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t("motivation.title")}
        </h2>
      </motion.div>

      <InstructionCard
        text={t("motivation.instruction")}
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
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 * i, duration: 0.35 }}
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
            <div className="flex items-center gap-3 pr-8">
              <span className="text-2xl">{opt.emoji}</span>
              <span className="text-foreground font-medium text-base">{t(opt.key)}</span>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <DandySpeechBubble text={t("motivation.dandy")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Scene3Motivation;
