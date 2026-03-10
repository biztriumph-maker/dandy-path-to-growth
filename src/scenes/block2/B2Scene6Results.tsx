import { motion } from "framer-motion";
import DandySpeechBubble from "../../components/DandySpeechBubble";

interface B2Scene6Props {
  t: (key: string) => string;
  completed: boolean;
  onGoToTest?: () => void;
}

const B2Scene6Results = ({ t, completed, onGoToTest }: B2Scene6Props) => {
  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-6 py-8 text-center">
        <motion.div
          className="space-y-5 max-w-sm"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-foreground">
            {t("test.b2complete.title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("test.b2complete.subtitle")}
          </p>
          <motion.button
            className="w-full px-6 py-4 rounded-full font-bold text-lg gradient-primary text-primary-foreground shadow-button hover:opacity-90 active:scale-95 transition-all"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={onGoToTest}
          >
            {t("test.goto")}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 px-5 py-6 overflow-y-auto">
      <motion.h2
        className="text-2xl font-bold text-foreground text-center mb-5"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("b2.s6.title")}
      </motion.h2>

      {/* Factors */}
      <motion.div
        className="p-4 rounded-2xl bg-card border border-border shadow-card mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
          {t("b2.s6.factors")}
        </p>
      </motion.div>

      {/* Comparison */}
      <motion.div
        className="space-y-2 mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 p-3 rounded-xl bg-destructive/5 border border-destructive/20">
          <span className="text-xl">🌀</span>
          <span className="text-foreground font-medium text-sm">{t("b2.s6.compare1")}</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
          <span className="text-xl">⚙️</span>
          <span className="text-foreground font-medium text-sm">{t("b2.s6.compare2")}</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/10 border border-accent/20">
          <span className="text-xl">📊</span>
          <span className="text-foreground font-medium text-sm">{t("b2.s6.compare3")}</span>
        </div>
      </motion.div>

      <motion.div
        className="mb-5"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <DandySpeechBubble text={t("b2.s6.dandy")} />
      </motion.div>

      <motion.p
        className="text-center text-foreground font-bold text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        ✨ {t("b2.s6.bottom")}
      </motion.p>
    </div>
  );
};

export default B2Scene6Results;
