import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DandySpeechBubble from "../components/DandySpeechBubble";
import InstructionCard from "../components/InstructionCard";
import { Check } from "lucide-react";

interface Scene4Props {
  t: (key: string) => string;
  onCorrect: () => void;
}

const Scene4Mistakes = ({ t, onCorrect }: Scene4Props) => {
  const [selected, setSelected] = useState<number | null>(null);

  const options = [
    { key: "mistakes.opt1", hintKey: "mistakes.opt1.hint", iconKey: "mistakes.opt1.icon" },
    { key: "mistakes.opt2", hintKey: "mistakes.opt2.hint", iconKey: "mistakes.opt2.icon" },
    { key: "mistakes.opt3", hintKey: "mistakes.opt3.hint", iconKey: "mistakes.opt3.icon" },
  ];

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    onCorrect();
  };

  return (
    <div className="flex flex-col flex-1 px-5 py-6 overflow-y-auto">
      <motion.div
        className="text-center mb-3"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t("mistakes.title")}
        </h2>
      </motion.div>

      <InstructionCard
        text={t("mistakes.instruction")}
        active={selected === null}
        icon="🎯"
        className="mb-4"
      />

      <div className="space-y-3 mb-4">
        {options.map(({ key, hintKey, iconKey }, i) => (
          <motion.button
            key={i}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all relative ${
              selected === i
                ? "border-primary bg-primary/10"
                : selected !== null
                  ? "border-border bg-card opacity-60"
                  : "border-border bg-card hover:border-primary/40 hover:shadow-lg hover:z-10"
            }`}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 * i, duration: 0.35 }}
            whileHover={selected === null ? { scale: 1.03, y: -8 } : {}}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(i)}
            disabled={selected !== null}
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
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none mt-0.5 shrink-0">{t(iconKey)}</span>
              <div className="flex-1 pr-6">
                <span className="text-foreground font-semibold leading-snug block">
                  🔹 {t(key)}
                </span>
                <span className="text-muted-foreground text-sm mt-1 block">
                  👉 {t(hintKey)}
                </span>
              </div>
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
            <DandySpeechBubble text={t("mistakes.dandy")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Scene4Mistakes;
