import { motion } from "framer-motion";
import DandySpeechBubble from "../../components/DandySpeechBubble";

interface B2Scene1Props {
  t: (key: string) => string;
}

const points = [
  { titleKey: "b2.s1.point1.title", descKey: "b2.s1.point1.desc", emoji: "🔧" },
  { titleKey: "b2.s1.point2.title", descKey: "b2.s1.point2.desc", emoji: "💡" },
  { titleKey: "b2.s1.point3.title", descKey: "b2.s1.point3.desc", emoji: "🎯" },
];

const B2Scene1Path = ({ t }: B2Scene1Props) => {
  return (
    <div className="flex flex-col flex-1 px-5 py-6 overflow-y-auto">
      <motion.h2
        className="text-2xl font-bold text-foreground text-center mb-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("b2.s1.title")}
      </motion.h2>

      <motion.p
        className="text-base text-muted-foreground text-center mb-6 whitespace-pre-line leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {t("b2.s1.intro")}
      </motion.p>

      <div className="space-y-3 mb-6">
        {points.map(({ titleKey, descKey, emoji }, i) => (
          <motion.div
            key={i}
            className="p-4 rounded-2xl bg-card border border-border shadow-card"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.15, duration: 0.4 }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5 shrink-0">{emoji}</span>
              <div>
                <p className="font-bold text-foreground text-base">{t(titleKey)}</p>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                  {t(descKey)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <DandySpeechBubble text={t("b2.s1.dandy")} />
      </motion.div>
    </div>
  );
};

export default B2Scene1Path;
