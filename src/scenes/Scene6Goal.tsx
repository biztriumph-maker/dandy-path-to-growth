import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DandyCharacter from "../components/DandyCharacter";
import DandySpeechBubble from "../components/DandySpeechBubble";
import InstructionCard from "../components/InstructionCard";
import { Check } from "lucide-react";

interface Scene6Props {
  selected: string | null;
  onSelect: (goal: string) => void;
  t: (key: string) => string;
  completed: boolean;
  onFinish: () => void;
}

const presets = ["$200", "$500", "$1,000"];

const Scene6Goal = ({ selected, onSelect, t, completed, onFinish }: Scene6Props) => {
  const [custom, setCustom] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [customConfirmed, setCustomConfirmed] = useState(false);

  const handlePreset = (val: string) => {
    setShowCustom(false);
    setCustomConfirmed(false);
    onSelect(val);
  };

  const handleCustomClick = () => {
    setShowCustom(true);
    setCustomConfirmed(false);
    onSelect("");
  };

  const handleCustomChange = (val: string) => {
    setCustom(val);
    setCustomConfirmed(false);
    if (val) onSelect(`$${val}`);
    else onSelect("");
  };

  const handleCustomConfirm = () => {
    if (custom) {
      setCustomConfirmed(true);
    }
  };

  const showDandy = (selected && selected.length > 0 && !showCustom) || customConfirmed;
  const goalChosen = selected && selected.length > 0;

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-6 py-8 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <DandyCharacter size="lg" speaking />
        </motion.div>
        <motion.div
          className="mt-8 space-y-4 max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-foreground">{t("goal.complete.title")}</h2>
          <p className="text-lg text-muted-foreground">{t("goal.complete.subtitle")}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 px-5 py-6 items-center overflow-y-auto">
      <motion.h2
        className="text-2xl font-bold text-foreground text-center mb-3"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {t("goal.title")}
      </motion.h2>

      <InstructionCard
        text={t("goal.instruction")}
        active={!goalChosen}
        icon="🎯"
        className="mb-4 w-full max-w-sm"
      />

      <div className="grid grid-cols-3 gap-2 w-full max-w-sm mb-4">
        {presets.map((val, i) => (
          <motion.button
            key={val}
            className={`p-3 rounded-2xl border-2 font-bold text-base whitespace-nowrap transition-all relative ${
              selected === val
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-foreground hover:border-primary/40 hover:shadow-lg hover:z-10"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            whileHover={selected !== val ? { scale: 1.03, y: -8 } : {}}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePreset(val)}
          >
            {selected === val && (
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Check className="w-3 h-3 text-primary-foreground" />
              </motion.div>
            )}
            {val}/мес
          </motion.button>
        ))}
      </div>

      <motion.button
        className={`w-full max-w-xs p-4 rounded-2xl border-2 font-semibold transition-all mb-4 ${
          showCustom
            ? "border-primary bg-primary/10 text-primary"
            : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:shadow-lg hover:z-10"
        }`}
        whileHover={!showCustom ? { scale: 1.03, y: -8 } : {}}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={handleCustomClick}
      >
        {t("goal.custom")}
      </motion.button>

      {showCustom && (
        <motion.div
          className="w-full max-w-xs mb-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <div className="flex items-center gap-2 p-3 rounded-xl border-2 border-primary bg-card">
            <span className="text-lg font-bold text-foreground">$</span>
            <input
              type="number"
              autoComplete="off"
              value={custom}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder={t("goal.customPlaceholder")}
              className="flex-1 bg-transparent text-lg font-semibold text-foreground outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            {!customConfirmed && (
              <motion.button
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  custom
                    ? "gradient-primary text-primary-foreground shadow-button"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
                whileTap={custom ? { scale: 0.95 } : {}}
                onClick={handleCustomConfirm}
                disabled={!custom}
              >
                ОК
              </motion.button>
            )}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showDandy && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-sm mt-2"
          >
            <DandySpeechBubble text={t("goal.dandy")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Scene6Goal;
