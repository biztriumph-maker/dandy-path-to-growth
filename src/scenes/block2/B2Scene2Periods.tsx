import { motion } from "framer-motion";
import DandySpeechBubble from "../../components/DandySpeechBubble";

interface B2Scene2Props {
  t: (key: string) => string;
}

const CalendarVisual = () => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="rounded-2xl bg-card border border-border shadow-card p-4">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-sm font-semibold text-muted-foreground">📅</span>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: "hsl(265 60% 55% / 0.2)" }} />
            <span>1–14</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: "hsl(35 90% 58% / 0.25)" }} />
            <span>15–31</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">
            {d}
          </div>
        ))}
        {/* Offset for month starting on Wednesday */}
        {[0, 1].map((i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const isPeriod1 = day <= 14;
          const isPayDay = day === 1 || day === 15;
          const isLimitDay = day === 2 || day === 16;
          return (
            <motion.div
              key={day}
              className={`relative text-center py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isPayDay
                  ? "ring-2 ring-primary text-primary font-extrabold"
                  : isPeriod1
                    ? "text-foreground"
                    : "text-foreground"
              }`}
              style={{
                background: isPeriod1
                  ? "hsl(265 60% 55% / 0.15)"
                  : "hsl(35 90% 58% / 0.18)",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.02 * day, duration: 0.2 }}
            >
              {day}
              {isLimitDay && (
                <div className="absolute inset-0 border-t-2 border-r-2 border-primary rounded-tr-lg pointer-events-none" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const B2Scene2Periods = ({ t }: B2Scene2Props) => {
  return (
    <div className="flex flex-col flex-1 px-5 py-6 overflow-y-auto">
      <motion.h2
        className="text-2xl font-bold text-foreground text-center mb-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("b2.s2.title")}
      </motion.h2>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex gap-2 mb-3">
          <div className="flex-1 p-3 rounded-xl text-center font-bold text-sm" style={{ background: "hsl(265 60% 55% / 0.15)" }}>
            📋 {t("b2.s2.period1")}
          </div>
          <div className="flex-1 p-3 rounded-xl text-center font-bold text-sm" style={{ background: "hsl(35 90% 58% / 0.18)" }}>
            📋 {t("b2.s2.period2")}
          </div>
        </div>
        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
          {t("b2.s2.explain")}
        </p>
      </motion.div>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <CalendarVisual />
      </motion.div>

      <motion.div
        className="mb-4 p-4 rounded-2xl bg-card border border-border shadow-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="font-bold text-foreground text-base mb-2">
          💳 {t("b2.s2.payouts.title")}
        </p>
        <div 
          className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed"
          dangerouslySetInnerHTML={{ __html: t("b2.s2.payouts.desc") }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <DandySpeechBubble text={t("b2.s2.dandy")} />
      </motion.div>
    </div>
  );
};

export default B2Scene2Periods;
