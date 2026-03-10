import { motion } from "framer-motion";
import DandySpeechBubble from "../components/DandySpeechBubble";

interface Scene5Props {
  t: (key: string) => string;
}

const Scene5Formula = ({ t }: Scene5Props) => {
  const steps = [
    { label: t("formula.step1"), emoji: "⚡", desc: t("formula.step1.desc") },
    { label: t("formula.step2"), emoji: "💎", desc: t("formula.step2.desc") },
    { label: t("formula.step3"), emoji: "📈", desc: t("formula.step3.desc") },
    { label: t("formula.step4"), emoji: "💰", desc: t("formula.step4.desc") },
  ];

  return (
    <div className="flex flex-col flex-1 px-5 py-6 items-center overflow-y-auto">
      <motion.h2
        className="text-2xl font-bold text-foreground text-center mb-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("formula.title")}
      </motion.h2>

      <div className="flex flex-col items-center gap-2 w-full max-w-xs mb-6">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.3, duration: 0.5, ease: "easeOut" }}
            className="w-full"
          >
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-card shadow-card border border-border">
              <span className="text-3xl">{step.emoji}</span>
              <div>
                <p className="font-bold text-foreground text-lg">{step.label}</p>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <motion.div
                className="flex justify-center py-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.3 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M12 19l-5-5M12 19l5-5" stroke="hsl(265 60% 55%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mb-6 max-w-sm w-full"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <DandySpeechBubble text={t("formula.dandy")} typingDelay={1500} />
      </motion.div>
    </div>
  );
};

export default Scene5Formula;
