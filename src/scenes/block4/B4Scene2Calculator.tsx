import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DandySpeechBubble from "../../components/DandySpeechBubble";
import NavigationButtons from "../../components/NavigationButtons";
import { HighlightVip } from "../../components/HighlightVip";

interface B4Scene2Props {
  t: (key: string) => string;
  onReady: () => void;
  onBack?: () => void;
}

/* ─── справочные данные ──────────────────────────────────────────── */
const currencies = [
  { key: "rub", symbol: "₽", rate: 100 },
  { key: "kzt", symbol: "₸", rate: 500 },
  { key: "kgs", symbol: "сом", rate: 12000 },
  { key: "usd", symbol: "$", rate: 1 },
];

const packagesData = [
  { key: "client",  label: "Клиент",  pct: 0,  limit: 0 },
  { key: "partner", label: "Партнёр", pct: 6,  limit: 500 },
  { key: "business",label: "Бизнес",  pct: 6,  limit: 1000 },
  { key: "elite",   label: "Элит",    pct: 8,  limit: 2000 },
  { key: "vip",     label: "VIP",     pct: 8,  limit: 8000 },
];

const limitsInfo = [
  { pkg: "client",  cap: 0 },
  { pkg: "partner", cap: 500 },
  { pkg: "business",  cap: 1000 },
  { pkg: "elite",    cap: 2000 },
  { pkg: "vip",     cap: 8000 },
];

/* ─── вспомогательные функции ────────────────────────────────────── */
function clampInt(val: string, min = 0): number {
  const n = parseInt(val.replace(/\D/g, ""), 10);
  return isNaN(n) ? min : Math.max(min, n);
}

function formatMoney(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000)
    return n.toLocaleString("ru-RU", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  return n.toFixed(1);
}

/* ─── компонент ──────────────────────────────────────────────────── */
const B4Scene2Calculator = ({ t, onReady, onBack }: B4Scene2Props) => {
  const [showContent, setShowContent] = useState(false);
  const [currency, setCurrency] = useState(0);
  const [selectedPkg, setSelectedPkg] = useState(0);
  const [justClicked, setJustClicked] = useState<string | null>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleClick = (id: string, action: () => void) => {
    action();
    setJustClicked(id);
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => setJustClicked(null), 1500);
  };

  // block 3 – activation conditions
  const [leftPartners, setLeftPartners]   = useState<string>("0");
  const [rightPartners, setRightPartners] = useState<string>("0");

  // block 4 – leg volumes
  const [leftPV, setLeftPV]   = useState<string>("0");
  const [rightPV, setRightPV] = useState<string>("0");

  /* ─── производные ─── */
  const cur = currencies[currency];
  const pkg = packagesData[selectedPkg];

  const lp = clampInt(leftPartners);
  const rp = clampInt(rightPartners);
  const L  = clampInt(leftPV);
  const R  = clampInt(rightPV);

  const isClientPkg = pkg.pct === 0;
  const activationOk = lp >= 1 && rp >= 2;
  const binaryActive = activationOk && !isClientPkg;

  /* ─── расчёт PV ─── */
  let pvWriteOff = 0;
  let pvPayable  = 0;
  let leftCarry  = L;
  let rightCarry = R;

  if (binaryActive) {
    const smaller = Math.min(L, R);
    pvWriteOff  = smaller;
    pvPayable   = smaller;
    if (L <= R) {
      leftCarry  = 0;
      rightCarry = R - L;
    } else {
      rightCarry = 0;
      leftCarry  = L - R;
    }
  }

  /* ─── расчёт денег ─── */
  const rawAccruedPV    = pvPayable * (pkg.pct / 100);
  const cappedAccruedPV = binaryActive ? Math.min(rawAccruedPV, pkg.limit) : 0;
  const pvOverLimit     = binaryActive ? Math.max(0, rawAccruedPV - pkg.limit) : 0;

  const depositPV       = cappedAccruedPV * 0.10;
  const balancePV       = cappedAccruedPV - depositPV;
  const payout          = balancePV * cur.rate;

  /* ─── рейт-строка ─── */
  const rateHint = "1 PV = 100₽ = 500₸ = 12 000 сом = $1";

  /* ─── input styles ─── */
  const [highlightedInput, setHighlightedInput] = useState<string | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout>>();

  const inputCls = (id: string) =>
    `w-full px-3 py-2.5 rounded-xl border-2 bg-card text-center text-base font-bold text-foreground focus:border-primary focus:outline-none transition-colors ${
      highlightedInput === id ? "border-primary ring-2 ring-primary/40" : "border-border"
    }`;

  const handleFocus = (setter: (v: string) => void) => () => {
    setter("");
  };

  const handleBlur = (val: string, setter: (v: string) => void) => () => {
    if (val === "" || val === "0") {
      setter("0");
    }
  };

  const highlightInput = (id: string) => {
    setHighlightedInput(id);
    clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlightedInput(null), 2000);
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="flex-1 px-5 py-4 flex flex-col gap-4">

        {/* ── Dandy подсказка ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <DandySpeechBubble
            text={t("b4.s2.dandy")}
            onComplete={() => {
              setTimeout(() => setShowContent(true), 1500);
            }}
          />
        </motion.div>

        {showContent && (
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >

        {/* ── заголовок ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-xl font-bold text-foreground leading-snug">
            {t("b4.s2.title")}
          </h2>
        </motion.div>

        {/* ════ БЛОК 0 — Ограничения ════ */}
        <motion.div
          className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/15 to-accent/10 shadow-soft p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-base font-extrabold text-foreground mb-1 leading-snug">
            {t("b4.s2.limitsTitle")}
          </p>
          <p className="text-xs font-normal text-muted-foreground mb-3">
            {t("b4.s2.limitsSubtitle")}
          </p>
          <div className="space-y-2">
            {limitsInfo.map((row) => (
              <div
                key={row.pkg}
                className="flex justify-between items-center"
              >
                <span className="text-sm font-bold text-foreground">{t(`b4.s2.pkg.${row.pkg}`)}</span>
                {row.cap ? (
                  <span className="text-sm text-muted-foreground">
                    {t("b4.s2.limitsMax")}:{" "}
                    <span className="font-extrabold text-foreground">
                      {row.cap.toLocaleString("ru-RU")} PV
                    </span>
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-destructive">
                    {t("b4.s2.limitsNone")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ════ БЛОК 1 — Валюта ════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <p className="text-sm font-bold text-foreground mb-2">
            {t("b4.s2.chooseCurrency")}
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {currencies.map((c, i) => (
              <motion.button
                key={c.key}
                className={`py-2.5 rounded-xl text-[13px] font-bold border-2 transition-all ${
                  currency === i
                    ? `border-primary bg-primary/10 text-primary${justClicked === `cur-${i}` ? ' ring-2 ring-primary/50' : ''}`
                    : "border-border bg-card text-foreground hover:border-primary/40"
                }`}
                whileHover={currency !== i ? { scale: 1.03, y: -2 } : {}}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleClick(`cur-${i}`, () => setCurrency(i))}
              >
                {t(`b4.s2.cur.${c.key}`)}
              </motion.button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 text-center">
            1 PV = {cur.rate.toLocaleString("ru-RU")} {cur.symbol}
          </p>
        </motion.div>

        {/* ════ БЛОК 2 — Пакет ════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm font-bold text-foreground mb-2">
            {t("b4.s2.choosePackage")}
          </p>
          <div className="grid grid-cols-5 gap-1">
            {packagesData.map((p, i) => (
              <motion.button
                key={p.key}
                className={`py-2 rounded-xl text-[13px] font-bold border-2 transition-all ${
                  selectedPkg === i
                    ? `border-primary bg-primary/10 text-primary${justClicked === `pkg-${i}` ? ' ring-2 ring-primary/50' : ''}`
                    : "border-border bg-card text-foreground hover:border-primary/40"
                }`}
                whileHover={selectedPkg !== i ? { scale: 1.05, y: -2 } : {}}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleClick(`pkg-${i}`, () => setSelectedPkg(i))}
              >
                <div className="leading-tight"><HighlightVip text={t(`b4.s2.pkg.${p.key}`)} /></div>
                <div className="text-[15px] font-black mt-0.5">
                  {p.pct}%
                </div>
              </motion.button>
            ))}
          </div>

          {/* индикатор пакета */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPkg}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-3 flex gap-2 justify-center flex-wrap"
            >
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full border text-[13px] font-medium transition-colors ${
                isClientPkg 
                  ? "bg-destructive/10 border-destructive/30 text-destructive/80" 
                  : "bg-primary/15 border-primary/30 text-primary"
              }`}>
                {t("b4.s2.binaryPct")}: <strong className={`ml-1.5 text-base font-black ${isClientPkg ? "text-destructive" : ""}`}>{pkg.pct}%</strong>
              </span>
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full border text-[13px] font-medium transition-colors ${
                isClientPkg 
                  ? "bg-destructive/10 border-destructive/30 text-destructive/80" 
                  : "bg-accent/15 border-accent/30 text-accent-foreground"
              }`}>
                {t("b4.s2.limit")}: <strong className={`ml-1.5 text-base font-black ${isClientPkg ? "text-destructive" : ""}`}>{pkg.limit.toLocaleString("ru-RU")} PV</strong>
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ════ БЛОК 3 — Условия активации ════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={isClientPkg ? "opacity-30 pointer-events-none relative" : "relative"}
        >
          {isClientPkg && (
            <div className="absolute inset-0 z-10 backdrop-blur-[1px] bg-background/20 rounded-xl" />
          )}
          <p className="text-sm font-bold text-foreground mb-1 relative z-20">
            {t("b4.s2.partnersTitle")}
          </p>
          <p className="text-[11px] text-muted-foreground mb-2.5 leading-snug">
            {t("b4.s2.partnersHint")}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {/* Левая */}
            <div>
              <p className="mb-1.5 text-left">
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: "hsla(200, 55%, 50%, 0.12)",
                    color: "hsl(200, 55%, 45%)",
                  }}
                >
                  {t("b4.s2.leftBranch")}
                </span>
              </p>
              <div className="flex items-center justify-start">
                <input
                  type="number"
                  min={0}
                  autoComplete="off"
                  value={leftPartners === "0" ? "" : leftPartners}
                  onFocus={handleFocus(setLeftPartners)}
                  onBlur={handleBlur(leftPartners, setLeftPartners)}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") { setLeftPartners("0"); return; }
                    setLeftPartners(String(Math.max(0, parseInt(val, 10) || 0)));
                    highlightInput("lp");
                  }}
                  placeholder="0"
                  className={inputCls("lp")}
                />
              </div>
            </div>

            {/* Правая */}
            <div>
              <p className="mb-1.5 text-right">
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: "hsla(25, 55%, 50%, 0.12)",
                    color: "hsl(25, 55%, 45%)",
                  }}
                >
                  {t("b4.s2.rightBranch")}
                </span>
              </p>
              <div className="flex items-center justify-end">
                <input
                  type="number"
                  min={0}
                  autoComplete="off"
                  value={rightPartners === "0" ? "" : rightPartners}
                  onFocus={handleFocus(setRightPartners)}
                  onBlur={handleBlur(rightPartners, setRightPartners)}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") { setRightPartners("0"); return; }
                    setRightPartners(String(Math.max(0, parseInt(val, 10) || 0)));
                    highlightInput("rp");
                  }}
                  placeholder="0"
                  className={inputCls("rp")}
                />
              </div>
            </div>
          </div>

          {/* статус активации */}
          <AnimatePresence mode="wait">
            <motion.div
              key={binaryActive ? "ok" : "no"}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 ${
                binaryActive
                  ? "bg-green-500/15 border border-green-500/40 text-green-700 dark:text-green-400"
                  : "bg-destructive/15 border border-destructive/40 text-destructive"
              }`}
            >
              <span className="text-base leading-none">{binaryActive ? "✓" : "✗"}</span>
              <span className="text-center">
                {isClientPkg ? (
                  <>{t("b4.s2.statusClientNo")}</>
                ) : binaryActive ? (
                  <>{t("b4.s2.statusOk")} <strong className="font-extrabold ml-1 uppercase">{t("b4.s2.statusOkBold")}</strong></>
                ) : (
                  <>{t("b4.s2.statusFail")} <strong className="font-extrabold ml-1 uppercase">{t("b4.s2.statusFailBold")}</strong></>
                )}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ════ БЛОК 4 — Объём в ногах ════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={isClientPkg ? "opacity-30 pointer-events-none relative" : "relative"}
        >
          {isClientPkg && (
            <div className="absolute inset-0 z-10 backdrop-blur-[1px] bg-background/20 rounded-xl" />
          )}
          <p className="text-sm font-bold text-foreground mb-1 relative z-20">
            {t("b4.s2.volumeTitle")}
          </p>
          <p className="text-[11px] text-muted-foreground mb-2.5">
            {t("b4.s2.volumeHint")}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {/* Левая нога */}
            <div>
              <p className="mb-1.5 text-left">
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: "hsla(200, 55%, 50%, 0.12)",
                    color: "hsl(200, 55%, 45%)",
                  }}
                >
                  {t("b4.s2.leftBranch")}
                </span>
              </p>
              <div className="flex items-center justify-start">
                <input
                  type="number"
                  min={0}
                  autoComplete="off"
                  value={leftPV === "0" ? "" : leftPV}
                  onFocus={handleFocus(setLeftPV)}
                  onBlur={handleBlur(leftPV, setLeftPV)}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") { setLeftPV("0"); return; }
                    setLeftPV(String(Math.max(0, parseInt(val, 10) || 0)));
                    highlightInput("lpv");
                  }}
                  placeholder="0"
                  className={inputCls("lpv")}
                />
              </div>
            </div>

            {/* Правая нога */}
            <div>
              <p className="mb-1.5 text-right">
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: "hsla(25, 55%, 50%, 0.12)",
                    color: "hsl(25, 55%, 45%)",
                  }}
                >
                  {t("b4.s2.rightBranch")}
                </span>
              </p>
              <div className="flex items-center justify-end">
                <input
                  type="number"
                  min={0}
                  autoComplete="off"
                  value={rightPV === "0" ? "" : rightPV}
                  onFocus={handleFocus(setRightPV)}
                  onBlur={handleBlur(rightPV, setRightPV)}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") { setRightPV("0"); return; }
                    setRightPV(String(Math.max(0, parseInt(val, 10) || 0)));
                    highlightInput("rpv");
                  }}
                  placeholder="0"
                  className={inputCls("rpv")}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ════ БЛОК 5 — Результаты ════ */}
        <motion.div
          className="rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border-2 border-primary/30 shadow-soft p-4 space-y-2"
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          {/* статус бонуса */}
          {!binaryActive && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/25 px-3 py-2 mb-3">
              <p className="text-xs font-semibold text-destructive text-center leading-snug">
                {isClientPkg
                  ? t("b4.s2.noBonusClient")
                  : t("b4.s2.noBonusCond")}
              </p>
            </div>
          )}

          {/* PV к списанию */}
          <div className="flex justify-between text-sm mb-3">
            <span className="text-muted-foreground">{t("b4.s2.pvWriteOff")}</span>
            <span className="font-bold text-foreground">{pvWriteOff} PV</span>
          </div>

          {/* остаток */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 mb-2">
            <p className="text-xs font-semibold text-foreground mb-2">
              {t("b4.s2.carryTitle")}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground text-xs">{t("b4.s2.leftBranch")}</span>
                <span className="font-bold text-foreground text-xs">
                  {leftCarry} PV
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground text-xs">{t("b4.s2.rightBranch")}</span>
                <span className="font-bold text-foreground text-xs">
                  {rightCarry} PV
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-sm border-b border-primary/15 pb-2 mb-2">
            <span className="text-muted-foreground">{t("b4.s2.pvPayable")}</span>
            <span className="font-bold text-foreground">{pvPayable} PV</span>
          </div>

          {/* деньги */}
          <div className="border-t border-primary/15 pt-2 mt-1 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("b4.s2.pctLabel")}</span>
              <span className="font-bold text-foreground">{pkg.pct}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("b4.s2.accruedPV")}</span>
              <span className="font-bold text-foreground">
                {formatMoney(cappedAccruedPV)} PV
              </span>
            </div>
            <AnimatePresence>
              {pvOverLimit > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-orange-500 dark:text-orange-400 font-medium">
                      {t("b4.s2.overLimit")}
                    </span>
                    <span className="font-bold text-orange-500 dark:text-orange-400">
                      {formatMoney(pvOverLimit)} PV
                    </span>
                  </div>
                  <p className="text-[11px] text-orange-500/80 dark:text-orange-400/80 mt-0.5 leading-snug">
                    {t("b4.s2.overLimitHint")} {pkg.limit.toLocaleString("ru-RU")} {t("b4.s2.overLimitPeriod")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="border-t border-primary/20 mt-2 pt-3 space-y-2">
              {/* Товарный депозит */}
              <div className="flex justify-between text-sm px-2 py-1.5 rounded-lg bg-orange-500/10">
                <span className="text-muted-foreground">{t("b4.s2.deposit")}</span>
                <span className="font-bold text-orange-500 dark:text-orange-400">
                  {depositPV.toFixed(1)} PV
                </span>
              </div>

              {/* Баланс для вывода средств */}
              <div className="flex justify-between text-sm px-2 py-1.5 rounded-lg bg-primary/5">
                <span className="text-muted-foreground">{t("b4.s2.balance")}</span>
                <span className="font-bold text-primary">
                  {balancePV.toFixed(1)} PV
                </span>
              </div>

              {/* Или к выплате */}
              <div className="px-2 py-2 rounded-lg bg-primary/10">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground text-base">{t("b4.s2.payout")}</span>
                  <motion.span
                    key={`${payout}-${currency}`}
                    initial={{ scale: 1.15, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-extrabold text-primary"
                  >
                    {formatMoney(payout)} {cur.symbol}
                  </motion.span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {balancePV.toFixed(1)} PV × {cur.rate.toLocaleString("ru-RU")} {cur.symbol} = {formatMoney(payout)} {cur.symbol}
                </p>
              </div>
            </div>
          </div>

          {/* мини-сводка */}
          <div className="mt-3 pt-3 border-t border-primary/10 space-y-1 text-xs text-muted-foreground">
            <p>{t("b4.s2.summaryPkg")}: {t(`b4.s2.pkg.${pkg.key}`)} ({pkg.pct}%)</p>
            <p>{t("b4.s2.summaryLimit")}: {pkg.limit.toLocaleString("ru-RU")} PV</p>
            <p>
              {t("b4.s2.summaryBranches")} = {L} PV / {t("b4.s2.summaryBranchR")} = {R} PV
            </p>
            <p>
              {t("b4.s2.summaryPVPay")}: {pvPayable} PV
            </p>
            <p>
              {t("b4.s2.summaryAccrued")}: {cappedAccruedPV.toFixed(1)} PV
            </p>
            <p>
              {t("b4.s2.summaryDeposit")}: {depositPV.toFixed(1)} PV
            </p>
            <p>
              {t("b4.s2.summaryBalance")}: {balancePV.toFixed(1)} PV
            </p>
            <p className="font-bold text-foreground">
              {t("b4.s2.summaryPayout")}: {formatMoney(payout)} {cur.symbol}
            </p>
          </div>
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

export default B4Scene2Calculator;
