import { useEffect } from "react";
import { motion } from "framer-motion";
import { dandyState } from "../../hooks/use-dandy";

interface B2Scene3Props {
  t: (key: string) => string;
}

const B2Scene3PV = ({ t }: B2Scene3Props) => {
  useEffect(() => {
    let stopped = false;
    dandyState.startTyping();
    const timer = setTimeout(() => {
      stopped = true;
      dandyState.stopTyping();
    }, 1600);
    return () => {
      clearTimeout(timer);
      if (!stopped) dandyState.stopTyping();
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 px-5 py-6 overflow-y-auto">
      <motion.h2
        className="text-2xl font-bold text-foreground text-center mb-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("b2.s3.title")}
      </motion.h2>

      <motion.p
        className="text-base text-muted-foreground text-center mb-5 whitespace-pre-line leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {t("b2.s3.explain")}
      </motion.p>

      {/* Important box */}
      <motion.div
        className="p-4 rounded-2xl bg-primary/5 border-2 border-primary/20 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <p className="font-bold text-foreground mb-1">⚠️ {t("b2.s3.important.title")}</p>
        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
          {t("b2.s3.important.desc")}
        </p>
      </motion.div>

      {/* Examples */}
      <motion.div
        className="p-4 rounded-2xl bg-card border border-border shadow-card mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="font-bold text-foreground mb-2">📦 {t("b2.s3.examples.title")}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">📦</span>
            <span className="text-foreground font-medium">{t("b2.s3.example1")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">🧴</span>
            <span className="text-foreground font-medium">{t("b2.s3.example2")}</span>
          </div>
        </div>
      </motion.div>

      {/* Analogy */}
      <motion.div
        className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
      >
        <p className="text-foreground font-semibold whitespace-pre-line leading-relaxed text-center">
          🚗 {t("b2.s3.analogy")}
        </p>
      </motion.div>

      {/* Bottom text */}
      <motion.p
        className="text-sm text-muted-foreground text-center whitespace-pre-line italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {t("b2.s3.bottom")}
      </motion.p>
    </div>
  );
};

export default B2Scene3PV;
