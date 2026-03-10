import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DandySpeechBubble from "../../components/DandySpeechBubble";
import NavigationButtons from "../../components/NavigationButtons";
import { HighlightVip } from "../../components/HighlightVip";

interface B3Scene4Props {
  t: (key: string) => string;
  userGoal?: string | null;
  onReady: () => void;
  onBack?: () => void;
}

const packagesData = [
  { key: "client", pct: 5 },
  { key: "partner", pct: 10 },
  { key: "business", pct: 12 },
  { key: "elite", pct: 15 },
  { key: "vip", pct: 20 },
];

const currencies = [
  { key: "rub", symbol: "₽", rate: 100 },
  { key: "kzt", symbol: "₸", rate: 500 },
  { key: "kgs", symbol: "сом", rate: 12000 },
  { key: "usd", symbol: "$", rate: 1 },
];

const B3Scene4Reward = ({ t, userGoal, onReady, onBack }: B3Scene4Props) => {
  const [showIntro, setShowIntro] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // State
  const [currency, setCurrency] = useState(0);
  const [selectedPkg, setSelectedPkg] = useState(0);
  const [goalAmount, setGoalAmount] = useState(() => {
    const savedGoal = userGoal || localStorage.getItem("dandy_income_goal");
    if (savedGoal) {
      const num = savedGoal.replace(/[^0-9]/g, "");
      return num || "0";
    }
    return "0";
  });
  const [products, setProducts] = useState(0);
  const [creams, setCreams] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      setTimeout(() => setShowContent(true), 300);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const cur = currencies[currency];
  const pkg = packagesData[selectedPkg];

  // Calculations
  const salesPV = products * 60 + creams * 120;
  const rewardPV = salesPV * (pkg.pct / 100);
  const depositPV = rewardPV * 0.1;
  const payoutPV = rewardPV - depositPV;
  const payout = payoutPV * cur.rate;

  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return amount.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    if (amount >= 1000) return amount.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    return amount.toFixed(1);
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="flex-1 px-5 py-6">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex items-center"
          >
            <DandySpeechBubble text={t("b3.s4.dandy.intro")} />
          </motion.div>
        ) : showContent ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col flex-1"
          >
            <motion.h2
              className="text-xl font-bold text-foreground text-center mb-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              🟣 {t("b3.s4.title")}
            </motion.h2>

            {/* Currency selector */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-sm font-semibold text-foreground mb-2">
                {t("b3.s4.chooseCurrency")}
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {currencies.map((c, i) => (
                  <motion.button
                    key={c.key}
                    className={`py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                      currency === i
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:border-primary/40"
                    }`}
                    whileHover={currency !== i ? { scale: 1.03, y: -3 } : {}}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setCurrency(i)}
                  >
                    {t(`b3.s4.cur.${c.key}`)}
                  </motion.button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 text-center">
                1 PV = {cur.rate.toLocaleString("ru-RU")} {cur.symbol}
              </p>
            </motion.div>

            {/* Package selector */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm font-semibold text-foreground mb-2">
                {t("b3.s4.choosePackage")}
              </p>
              <div className="grid grid-cols-5 gap-1">
                {packagesData.map((p, i) => (
                  <motion.button
                    key={p.key}
                    className={`py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                      selectedPkg === i
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:border-primary/40"
                    }`}
                    whileHover={selectedPkg !== i ? { scale: 1.05, y: -3 } : {}}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedPkg(i)}
                  >
                    <div><HighlightVip text={t(`b3.s3.pkg.${p.key}`)} /></div>
                    <div className="text-[10px] opacity-70">{p.pct}%</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Financial goal */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm font-semibold text-foreground mb-2">
                {t("b3.s4.goalLabel")}
              </p>
              <div className="flex items-center gap-2 p-2.5 rounded-xl border-2 border-border bg-card">
                <span className="text-sm font-bold">$</span>
                <input
                  type="number"
                  autoComplete="off"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  className="flex-1 bg-transparent text-sm font-semibold text-foreground outline-none"
                  placeholder={t("b3.s4.goalPlaceholder")}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t("b3.s4.goalHint")}
              </p>
            </motion.div>

            {/* Products slider */}
            <motion.div
              className="mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-semibold text-foreground">
                  {t("b3.s4.products")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  max={50}
                  autoComplete="off"
                  value={products === 0 ? "" : products}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") { setProducts(0); return; }
                    setProducts(Math.min(50, Math.max(0, parseInt(val, 10) || 0)));
                  }}
                  onBlur={() => { if (products === 0) setProducts(0); }}
                  className="w-20 px-3 py-2 rounded-xl border-2 border-border bg-card text-center text-sm font-bold text-foreground focus:border-primary focus:outline-none transition-colors"
                  placeholder="0"
                />
                <span className="text-xs text-muted-foreground">{t("b3.s4.unit.products")}</span>
                <span className="ml-auto text-sm font-bold text-primary">{products * 60} PV</span>
              </div>
            </motion.div>

            {/* Creams slider */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-semibold text-foreground">
                  {t("b3.s4.creams")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  max={30}
                  autoComplete="off"
                  value={creams === 0 ? "" : creams}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") { setCreams(0); return; }
                    setCreams(Math.min(30, Math.max(0, parseInt(val, 10) || 0)));
                  }}
                  onBlur={() => { if (creams === 0) setCreams(0); }}
                  className="w-20 px-3 py-2 rounded-xl border-2 border-border bg-card text-center text-sm font-bold text-foreground focus:border-primary focus:outline-none transition-colors"
                  placeholder="0"
                />
                <span className="text-xs text-muted-foreground">{t("b3.s4.unit.creams")}</span>
                <span className="ml-auto text-sm font-bold text-primary">{creams * 120} PV</span>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              className="p-4 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border-2 border-primary/30 shadow-soft space-y-2 mb-4"
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("b3.s4.volume")}</span>
                <span className="font-bold text-foreground">{salesPV} PV</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("b3.s4.commission")}</span>
                <span className="font-bold text-foreground">{pkg.pct}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("b3.s4.rewardPV")}</span>
                <span className="font-bold text-foreground">{rewardPV.toFixed(1)} PV</span>
              </div>

              <div className="border-t border-primary/20 mt-2 pt-3 space-y-2">
                <div className="flex justify-between text-sm px-2 py-1.5 rounded-lg bg-orange-500/10">
                  <span className="text-muted-foreground">{t("b3.s4.deposit")}</span>
                  <span className="font-bold text-orange-500 dark:text-orange-400">
                    {depositPV.toFixed(1)} PV
                  </span>
                </div>

                <div className="flex justify-between text-sm px-2 py-1.5 rounded-lg bg-primary/5">
                  <span className="text-muted-foreground">{t("b3.s4.balance")}</span>
                  <span className="font-bold text-primary">
                    {payoutPV.toFixed(1)} PV
                  </span>
                </div>

                <div className="px-2 py-2 rounded-lg bg-primary/10">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground text-base">{t("b3.s4.payout")}</span>
                    <motion.span
                      className="text-2xl font-extrabold text-primary"
                      key={payout}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      {formatMoney(payout)} {cur.symbol}
                    </motion.span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {payoutPV.toFixed(1)} PV × {cur.rate.toLocaleString("ru-RU")} {cur.symbol} = {formatMoney(payout)} {cur.symbol}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-3 pt-3 border-t border-primary/10 space-y-1 text-xs text-muted-foreground">
                <p>📦 {t("b3.s4.summaryPkg")}: <HighlightVip text={t(`b3.s3.pkg.${pkg.key}`)} /></p>
                <p>🛒 {t("b3.s4.summaryProducts")}: {products} | {t("b3.s4.summaryCreams")}: {creams}</p>
                <p>📊 {t("b3.s4.summaryVolume")}: {salesPV} PV</p>
                <p>💰 {t("b3.s4.summaryGross")}: {rewardPV.toFixed(1)} PV</p>
                <p>🏦 {t("b3.s4.summaryDeposit")}: {depositPV.toFixed(1)} PV</p>                  <p>💳 {t("b3.s4.summaryBalance")}: {payoutPV.toFixed(1)} PV</p>                <p className="font-bold text-foreground">
                  💸 {t("b3.s4.summaryPayout")}: {formatMoney(payout)} {cur.symbol}
                </p>
              </div>
            </motion.div>

            {/* Reactivation info */}
            <motion.div
              className="p-4 rounded-2xl bg-accent/10 border border-accent/30 space-y-2 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <h3 className="text-xl font-bold text-foreground text-center">{t("b3.s4.reactivation.title")}</h3>
              <p className="text-lg font-medium text-foreground/80 text-center mb-2">
                {t("b3.s4.reactivation.subtitle") || "(товарный депозит)"}
              </p>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                <p dangerouslySetInnerHTML={{ __html: `• ${t("b3.s4.reactivation.desc1")}` }} />
                <p>• {t("b3.s4.reactivation.desc2")}</p>
                <p dangerouslySetInnerHTML={{ __html: `• ${t("b3.s4.reactivation.desc3")}` }} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <DandySpeechBubble text={t("b3.s4.dandy.bottom")} />
            </motion.div>

          </motion.div>
        ) : null}
      </AnimatePresence>
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

export default B3Scene4Reward;
