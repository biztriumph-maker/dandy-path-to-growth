import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LanguageSwitcher from "../components/LanguageSwitcher";
import DandySpeechBubble from "../components/DandySpeechBubble";
import { Language, useTranslation } from "../lib/i18n";
import { getBlockCompletion } from "../lib/progress";

const blocks = [
  { id: 1, route: "/block1", icon: "🌱", scenes: 6 },
  { id: 2, route: "/block2", icon: "📊", scenes: 6 },
  { id: 3, route: "/block3", icon: "💰", scenes: 4 },
  { id: 4, route: "/block4", icon: "🔗", scenes: 5 },
  { id: 5, route: "/block5", icon: "🏆", scenes: 2 },
  { id: 6, route: "/block6", icon: "🤝", scenes: 4 },
];

const Dashboard = () => {
  const [lang, setLang] = useState<Language>(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang") as Language;
    const saved = localStorage.getItem("dandy_lang");
    return urlLang || (saved as Language) || "ru";
  });
  const navigate = useNavigate();
  const t = useTranslation(lang);

  const handleLangChange = (l: Language) => {
    setLang(l);
    localStorage.setItem("dandy_lang", l);
  };

  const completion = getBlockCompletion();

  const isUnlocked = (blockId: number) => {
    if (blockId === 1) return true;
    // Пройденный блок всегда остаётся доступным
    if (completion[blockId] === true) return true;
    return completion[blockId - 1] === true;
  };

  const handleBlockClick = (block: typeof blocks[0]) => {
    if (!isUnlocked(block.id)) return;
    navigate(`${block.route}?lang=${lang}`);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto gradient-hero">
      {/* Header */}
      <div className="flex justify-end px-4 pt-3">
        <LanguageSwitcher current={lang} onChange={handleLangChange} />
      </div>

      {/* Title */}
      <div className="px-4 pt-4 pb-2 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t("dash.title")}</h1>
      </div>

      {/* Dandy greeting */}
      <div className="px-4 py-2">
        <DandySpeechBubble text={t("dash.dandy")} />
      </div>

      {/* Block cards */}
      <div className="flex-1 px-4 py-4 space-y-3">
        {blocks.map((block, idx) => {
          const done = completion[block.id] === true;
          const unlocked = isUnlocked(block.id);

          return (
            <motion.button
              key={block.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              onClick={() => handleBlockClick(block)}
              disabled={!unlocked}
              className={`w-full text-left rounded-2xl p-4 border-2 transition-all ${
                done
                  ? "bg-primary/10 border-primary/40 shadow-md"
                  : unlocked
                  ? "bg-card border-border hover:border-primary/50 hover:shadow-lg cursor-pointer"
                  : "bg-muted/50 border-border/50 opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{block.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground">
                      {t(`dash.block${block.id}.title`)}
                    </h3>
                    {done && <span className="text-primary text-lg">✅</span>}
                  </div>
                  <p 
                    className="text-xs text-muted-foreground mt-1"
                    dangerouslySetInnerHTML={{ __html: t(`dash.block${block.id}.desc`) }}
                  />
                </div>
                {unlocked && !done && (
                  <motion.span
                    animate={{ scale: [1, 1.05, 1], boxShadow: ["0px 0px 0px rgba(var(--primary), 0)", "0px 0px 15px rgba(var(--primary), 0.5)", "0px 0px 0px rgba(var(--primary), 0)"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="text-sm font-bold bg-primary text-primary-foreground px-4 py-1.5 rounded-full shadow-md hover:bg-primary/90 transition-colors inline-block"
                  >
                    {t("dash.start")}
                  </motion.span>
                )}
                {!unlocked && (
                  <span className="text-lg">🔒</span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
