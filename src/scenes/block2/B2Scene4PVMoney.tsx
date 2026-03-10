import { motion } from "framer-motion";
import DandySpeechBubble from "../../components/DandySpeechBubble";

interface B2Scene4Props {
  t: (key: string) => string;
}

const B2Scene4PVMoney = ({ t }: B2Scene4Props) => {
  const steps = [
    { text: t("b2.s4.step1"), emoji: "📊" },
    { text: t("b2.s4.step2"), emoji: "📐" },
    { text: t("b2.s4.step3"), emoji: "💵" },
  ];

  const conversions = [
    { flag: "🇷🇺", text: t("b2.s4.conv.rub") },
    { flag: "🇰🇿", text: t("b2.s4.conv.kzt") },
    { flag: "🇺🇿", text: t("b2.s4.conv.uzs") },
    { flag: "🇺🇸", text: t("b2.s4.conv.usd") },
  ];

  return (
    <div className="flex flex-col flex-1 px-5 py-6 overflow-y-auto">
      <motion.h2
        className="text-2xl font-bold text-foreground text-center mb-5"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("b2.s4.title")}
      </motion.h2>

      {/* Steps */}
      <div className="space-y-2 mb-4">
        {steps.map(({ text, emoji }, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
          >
            <span className="text-xl shrink-0">{emoji}</span>
            <span className="text-foreground font-medium text-sm">{text}</span>
          </motion.div>
        ))}
      </div>

      {/* Note */}
      <motion.div
        className="p-4 rounded-2xl bg-primary/5 border-2 border-primary/20 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-sm text-foreground whitespace-pre-line leading-relaxed font-medium">
          {t("b2.s4.note")}
        </p>
      </motion.div>

      {/* Conversion table */}
      <motion.div
        className="p-4 rounded-2xl bg-card border border-border shadow-card mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
      >
        <p className="font-bold text-foreground text-sm mb-3">
          💱 {t("b2.s4.conversion.title")}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {conversions.map(({ flag, text }, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-secondary/50">
              <span className="text-lg">{flag}</span>
              <span className="text-sm font-semibold text-foreground">{text}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <DandySpeechBubble text={t("b2.s4.dandy")} />
      </motion.div>
    </div>
  );
};

export default B2Scene4PVMoney;
