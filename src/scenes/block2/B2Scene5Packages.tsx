import { motion } from "framer-motion";
import DandySpeechBubble from "../../components/DandySpeechBubble";
import { HighlightVip } from "../../components/HighlightVip";

interface B2Scene5Props {
  t: (key: string) => string;
}

const packages = [
  { nameKey: "b2.s5.client", pv: 60, count: 1, countKey: "b2.s5.product", tier: 0 },
  { nameKey: "b2.s5.partner", pv: 120, count: 2, countKey: "b2.s5.products2", tier: 1 },
  { nameKey: "b2.s5.business", pv: 180, count: 3, countKey: "b2.s5.products2", tier: 2 },
  { nameKey: "b2.s5.elite", pv: 240, count: 4, countKey: "b2.s5.products2", tier: 3 },
  { nameKey: "b2.s5.vip", pv: 324, count: 6, countKey: "b2.s5.products3", tier: 4, isVip: true },
];

const tierStyles = [
  "bg-muted/60 border-border text-muted-foreground",
  "bg-card border-border",
  "bg-card border-primary/20",
  "bg-primary/5 border-primary/30",
  "bg-gradient-to-r from-primary/15 to-accent/15 border-primary/50 ring-2 ring-primary/30",
];

const B2Scene5Packages = ({ t }: B2Scene5Props) => {
  return (
    <div className="flex flex-col flex-1 px-5 py-6 overflow-y-auto">
      <motion.h2
        className="text-2xl font-bold text-foreground text-center mb-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("b2.s5.title")}
      </motion.h2>

      {/* Package ladder */}
      <div className="space-y-2 mb-4">
        {packages.map(({ nameKey, pv, count, countKey, tier, isVip }, i) => (
          <motion.div
            key={i}
            className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${tierStyles[tier]}`}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.35 }}
          >
            <div className="flex items-center gap-2">
              <span className={`font-bold ${isVip ? "text-primary text-lg" : "text-foreground text-base"}`}>
                {isVip ? "⭐ " : ""}{t(nameKey)}
              </span>
              {isVip && (
                <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground text-[10px] font-bold">
                  {t("b2.s5.discount")}
                </span>
              )}
            </div>
            <div className="text-right">
              <span className={`font-extrabold ${isVip ? "text-primary text-lg" : "text-foreground"}`}>
                {pv} PV
              </span>
              <span className="text-muted-foreground text-xs ml-1.5">
                {count} {t(countKey)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Benefits */}
      <motion.div
        className="p-4 rounded-2xl bg-primary/5 border border-primary/20 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <p className="font-bold text-foreground mb-2">{t("b2.s5.benefits.title")}</p>
        <div className="space-y-1 text-sm text-foreground">
          <p>{t("b2.s5.benefit1")}</p>
          <p>{t("b2.s5.benefit2")}</p>
          <p>{t("b2.s5.benefit3")}</p>
        </div>
      </motion.div>

      {/* How to */}
      <motion.div
        className="p-4 rounded-2xl bg-card border border-border shadow-card mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95 }}
      >
        <p className="font-bold text-foreground mb-2">{t("b2.s5.howto.title")}</p>
        <div className="space-y-1.5 text-sm text-muted-foreground">
          <p>{t("b2.s5.howto1")}</p>
          <p>{t("b2.s5.howto1.5")}</p>
          <p>{t("b2.s5.howto2")}</p>
          <p><HighlightVip text={t("b2.s5.howto3")} /></p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <DandySpeechBubble text={t("b2.s5.dandy")} />
      </motion.div>
    </div>
  );
};

export default B2Scene5Packages;
