import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import DandySpeechBubble from "../../components/DandySpeechBubble";
import NavigationButtons from "../../components/NavigationButtons";
import { HighlightVip } from "../../components/HighlightVip";

interface B6Scene4Props {
  t: (key: string) => string;
  onReady: () => void;
  onBack?: () => void;
}

/* ─── matching bonus percentages: [package][status] → [L1, L2, L3] ─── */
const MATCH_PCT: Record<string, Record<string, number[]>> = {
  partner:  { mentor: [5, 0, 0],   master: [5, 0, 0],     advisor: [5, 0, 0]       },
  business: { mentor: [7.5, 0, 0], master: [7.5, 0, 0],   advisor: [7.5, 0, 0]     },
  elite:    { mentor: [10, 0, 0],  master: [10, 5, 0],     advisor: [10, 5, 2.5]    },
  vip:      { mentor: [10, 0, 0],  master: [10, 8, 0],     advisor: [10, 10, 8]     },
};

const PACKAGES = ["partner", "business", "elite", "vip"] as const;
const STATUSES = ["mentor", "master", "advisor"] as const;

function clampInt(val: string, min = 0, max = 9999): number {
  const n = parseInt(val.replace(/\D/g, ""), 10);
  return isNaN(n) ? min : Math.min(max, Math.max(min, n));
}

const B6Scene4MatchingCalc = ({ t, onReady, onBack }: B6Scene4Props) => {
  const [showContent, setShowContent] = useState(false);

  /* ─── inputs ─── */
  const [pkg, setPkg] = useState<string>("vip");
  const [status, setStatus] = useState<string>("advisor");
  const [justClicked, setJustClicked] = useState<string | null>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleBtnClick = (id: string, action: () => void) => {
    action();
    setJustClicked(id);
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => setJustClicked(null), 1500);
  };
  const [l1Count, setL1Count] = useState("0");
  const [l2Mult, setL2Mult] = useState("0");
  const [l3Mult, setL3Mult] = useState("0");
  const [l1Binary, setL1Binary] = useState("0");
  const [l2Binary, setL2Binary] = useState("0");
  const [l3Binary, setL3Binary] = useState("0");

  /* ─── calculations ─── */
  const calc = useMemo(() => {
    const pct = MATCH_PCT[pkg]?.[status] ?? [0, 0, 0];
    const L1 = clampInt(l1Count);
    const L2 = L1 * clampInt(l2Mult);
    const L3 = L2 * clampInt(l3Mult);
    const b1 = L1 * clampInt(l1Binary);
    const b2 = L2 * clampInt(l2Binary);
    const b3 = L3 * clampInt(l3Binary);
    const m1 = b1 * (pct[0] / 100);
    const m2 = b2 * (pct[1] / 100);
    const m3 = b3 * (pct[2] / 100);
    const total = m1 + m2 + m3;
    return {
      pct,
      partners: [L1, L2, L3],
      binaryTotals: [b1, b2, b3],
      matching: [m1, m2, m3],
      total,
      annual: total * 12,
    };
  }, [pkg, status, l1Count, l2Mult, l3Mult, l1Binary, l2Binary, l3Binary]);

  const inputCls =
    "w-full max-w-[90px] mx-auto px-1 py-0.5 rounded-md border border-border bg-card text-center text-sm font-bold text-foreground focus:border-primary focus:outline-none transition-colors";
  const inputDisabledCls =
    "w-full max-w-[90px] mx-auto px-1 py-0.5 rounded-md border border-border bg-muted/40 text-center text-sm font-bold text-muted-foreground cursor-not-allowed";

  const handleFocus = (setter: (v: string) => void) => () => setter("");
  const handleBlur = (val: string, setter: (v: string) => void) => () => {
    if (val === "") setter("0");
  };

  const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU");

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="flex-1 px-5 py-4 flex flex-col gap-4">
        {/* Dandy intro */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <DandySpeechBubble
            text={t("b6.s4.dandy.intro")}
            onComplete={() => setTimeout(() => setShowContent(true), 1500)}
          />
        </motion.div>

        {showContent && (
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h2 className="text-xl font-bold text-foreground leading-snug">
                {t("b6.s4.title")}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {t("b6.s4.subtitle")}
              </p>
            </motion.div>

            {/* ════ PACKAGE (was Status) ════ */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-sm font-bold text-foreground mb-2">
                {t("b6.s4.choosePackage")}
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {PACKAGES.map((p) => (
                  <motion.button
                    key={p}
                    className={`py-2.5 rounded-xl text-[13px] font-bold border-2 transition-all ${
                      pkg === p
                        ? `border-primary bg-primary/10 text-primary${justClicked === `pkg-${p}` ? ' ring-2 ring-primary/50' : ''}`
                        : "border-border bg-card text-foreground hover:border-primary/40"
                    }`}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleBtnClick(`pkg-${p}`, () => setPkg(p))}
                  >
                    <HighlightVip text={t(`b6.s4.st.${p}`)} />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* ════ STATUS (was Package) ════ */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <p className="text-sm font-bold text-foreground mb-2">
                {t("b6.s4.chooseStatus")}
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {STATUSES.map((s) => (
                  <motion.button
                    key={s}
                    className={`py-2.5 rounded-xl text-[13px] font-bold border-2 transition-all ${
                      status === s
                        ? `border-primary bg-primary/10 text-primary${justClicked === `st-${s}` ? ' ring-2 ring-primary/50' : ''}`
                        : "border-border bg-card text-foreground hover:border-primary/40"
                    }`}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleBtnClick(`st-${s}`, () => setStatus(s))}
                  >
                    {t(`b6.s4.pk.${s}`)}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* ════ COMBINED INPUT TABLE ════ */}
            <motion.div
              className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5 shadow-soft p-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Column headers */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <p className="text-xs font-bold text-foreground">{t("b6.s4.structureTitle")}</p>
                <p className="text-xs font-bold text-foreground whitespace-pre-line">{t("b6.s4.binaryTitle")}</p>
              </div>

              <div className="space-y-3">
                {[
                  { lvl: 1, lKey: "b6.s4.l1count", rKey: "b6.s4.l1binary", lVal: l1Count, lSet: setL1Count, rVal: l1Binary, rSet: setL1Binary },
                  { lvl: 2, lKey: "b6.s4.l2mult", rKey: "b6.s4.l2binary", lVal: l2Mult, lSet: setL2Mult, rVal: l2Binary, rSet: setL2Binary },
                  { lvl: 3, lKey: "b6.s4.l3mult", rKey: "b6.s4.l3binary", lVal: l3Mult, lSet: setL3Mult, rVal: l3Binary, rSet: setL3Binary },
                ].map((row) => {
                  const active = calc.pct[row.lvl - 1] > 0;
                  return (
                    <div key={row.lvl} className={!active ? "opacity-50" : ""}>
                      <div className="mb-1">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/15 text-primary">
                          {t("b6.s4.level")} {row.lvl}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-end gap-1">
                          <label className="text-[10px] text-muted-foreground leading-tight flex-1">{t(row.lKey)}</label>
                          <input type="text" inputMode="numeric" autoComplete="off" value={row.lVal}
                            onChange={(e) => row.lSet(e.target.value.replace(/\D/g, ""))}
                            onFocus={handleFocus(row.lSet)} onBlur={handleBlur(row.lVal, row.lSet)}
                            disabled={!active}
                            className={active ? inputCls : inputDisabledCls} />
                        </div>
                        <div className="flex items-end gap-1">
                          <label className="text-[10px] text-muted-foreground leading-tight flex-1">{t(row.rKey)}</label>
                          <input type="text" inputMode="numeric" autoComplete="off" value={row.rVal}
                            onChange={(e) => row.rSet(e.target.value.replace(/\D/g, ""))}
                            onFocus={handleFocus(row.rSet)} onBlur={handleBlur(row.rVal, row.rSet)}
                            disabled={!active}
                            className={active ? inputCls : inputDisabledCls} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* ════ STRUCTURE VISUALIZATION ════ */}
            <motion.div
              className="rounded-2xl bg-white/[0.04] border border-border shadow-card p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* YOU node */}
              <div className="flex flex-col items-center mb-3">
                <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center shadow-soft">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="7" r="4" fill="hsl(var(--primary))" />
                    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="hsl(var(--primary))" />
                  </svg>
                </div>
                <p className="mt-1 text-xs font-bold text-foreground uppercase tracking-wide">
                  {t("b6.s4.you")}
                </p>
              </div>

              {/* Level cards */}
              {[0, 1, 2].map((i) => {
                const active = calc.pct[i] > 0;
                const gradient = i === 0 ? "from-primary/15 to-accent/10" : i === 1 ? "from-purple-400/15 to-fuchsia-400/10" : "from-fuchsia-400/15 to-pink-400/10";
                const borderColor = i === 0 ? "border-primary/25" : i === 1 ? "border-purple-400/25" : "border-fuchsia-400/25";

                return (
                  <div key={i}>
                    {/* Connector line */}
                    <div className="flex justify-center my-1">
                      <div className="w-0.5 h-5 bg-border" />
                    </div>

                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${gradient} border ${borderColor} ${
                        !active ? "opacity-40" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/15 text-primary">
                          {t("b6.s4.level")} {i + 1}
                        </span>
                        <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                          active
                            ? "bg-white text-black"
                            : "bg-muted/30 text-muted-foreground"
                        }`}>
                          {calc.pct[i]}%
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-[11px] text-muted-foreground">{t("b6.s4.partners")}</p>
                          <p className="text-base font-extrabold text-foreground">{fmt(calc.partners[i])}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground">{t("b6.s4.binaryPer")}</p>
                          <p className="text-base font-extrabold text-foreground">{fmt(calc.binaryTotals[i])}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground">{t("b6.s4.matchingLabel")}</p>
                          <p className={`text-base font-extrabold ${active ? "text-fuchsia-400" : "text-muted-foreground"}`}>
                            {fmt(calc.matching[i])}
                          </p>
                        </div>
                      </div>
                      {!active && (
                        <p className="text-[11px] text-muted-foreground text-center mt-1 italic">
                          {t("b6.s4.notAvailable")}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* ════ MATCHING BREAKDOWN ════ */}
            <motion.div
              className="rounded-2xl bg-gradient-to-br from-purple-400/15 to-fuchsia-400/10 border border-purple-400/25 shadow-card p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <p className="text-sm font-bold text-foreground mb-3">
                {t("b6.s4.breakdownTitle")}
              </p>
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {t("b6.s4.level")} {i + 1}: {calc.pct[i]}% × {fmt(calc.binaryTotals[i])} PV
                    </span>
                    <span className="font-extrabold text-foreground">
                      = {fmt(calc.matching[i])} PV
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ════ TOTAL RESULT ════ */}
            <motion.div
              className="rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/30 shadow-card p-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="font-bold text-foreground text-sm text-center uppercase tracking-wide mb-2">
                {t("b6.s4.totalMonth")}
              </p>
              <p className="text-3xl font-black text-primary text-center">
                {fmt(calc.total)} PV
              </p>
              <div className="mt-3 pt-3 border-t border-primary/20 text-center">
                <p className="text-xs text-muted-foreground">{t("b6.s4.totalYear")}</p>
                <p className="text-lg font-extrabold text-foreground">
                  {fmt(calc.annual)} PV
                </p>
              </div>
            </motion.div>

            {/* Summary line */}
            <motion.div
              className="p-3 rounded-xl bg-muted/50 border border-border/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <div className="text-center text-xs text-muted-foreground">
                <span>{t("b6.s4.summaryPartners")}: <strong className="text-foreground">{fmt(calc.partners[0] + calc.partners[1] + calc.partners[2])}</strong></span>
              </div>
            </motion.div>

            {/* Dandy bottom */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <DandySpeechBubble text={t("b6.s4.dandy.bottom")} />
            </motion.div>
          </motion.div>
        )}
      </div>

      {showContent && (
        <NavigationButtons
          onBack={onBack}
          onNext={onReady}
          nextLabel={t("nav.next")}
          backLabel={t("nav.back")}
          showBack={!!onBack}
        />
      )}
    </div>
  );
};

export default B6Scene4MatchingCalc;
