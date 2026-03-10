import { useState } from "react";
import { motion } from "framer-motion";
import ProgressBar from "../components/ProgressBar";
import SceneWrapper from "../components/SceneWrapper";
import LanguageSwitcher from "../components/LanguageSwitcher";
import B5Scene1StatusBonus from "../scenes/block5/B5Scene1StatusBonus";
import B5Scene2StatusCards from "../scenes/block5/B5Scene2StatusCards";
import B5Scene3AdditionalConditions from "../scenes/block5/B5Scene3AdditionalConditions";
import Block5Test from "../scenes/block5/Block5Test";
import { Language, useTranslation } from "../lib/i18n";
import { markBlockComplete } from "../lib/progress";

const TOTAL_SCENES = 3;

const Block5 = () => {
  const [scene, setScene] = useState(1);
  const [sceneVisit, setSceneVisit] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [testKey, setTestKey] = useState(0);
  const [lang, setLang] = useState<Language>(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get("lang") as Language) || "ru";
  });

  const t = useTranslation(lang);

  const next = () => {
    if (scene === TOTAL_SCENES) {
      setCompleted(true);
    } else {
      setSceneVisit((v) => v + 1);
      setScene((s) => Math.min(s + 1, TOTAL_SCENES));
    }
  };
  const back = () => { setSceneVisit((v) => v + 1); setScene((s) => Math.max(s - 1, 1)); };

  const handleGoToTest = () => {
    setTestKey((k) => k + 1);
    setShowTest(true);
  };

  const handleTestComplete = () => {
    markBlockComplete(5);
    window.location.href = `/?lang=${lang}`;
  };

  const handleTestBack = () => {
    setShowTest(false);
  };

  if (showTest) {
    return <Block5Test key={testKey} t={t} onComplete={handleTestComplete} onBack={handleTestBack} />;
  }

  if (completed) {
    return (
      <div className="flex flex-col min-h-screen max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto gradient-hero">
        <div className="flex items-center justify-center flex-1 px-6 py-8 text-center">
          <motion.div
            className="space-y-5 max-w-sm"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-foreground">
              {t("test.b5complete.title")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("test.b5complete.subtitle")}
            </p>
            <motion.button
              className="w-full px-6 py-4 rounded-full font-bold text-lg gradient-primary text-primary-foreground shadow-button hover:opacity-90 active:scale-95 transition-all"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={handleGoToTest}
            >
              {t("test.goto")}
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto gradient-hero">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex-1">
          <ProgressBar current={scene} total={TOTAL_SCENES} t={t} />
        </div>
        <div className="ml-3 flex-shrink-0">
          <LanguageSwitcher current={lang} onChange={setLang} />
        </div>
      </div>

      <SceneWrapper sceneKey={`b5-${scene}-${sceneVisit}`}>
        {scene === 1 && <B5Scene1StatusBonus t={t} onReady={next} />}
        {scene === 2 && <B5Scene2StatusCards t={t} onReady={next} onBack={back} />}
        {scene === 3 && <B5Scene3AdditionalConditions t={t} onReady={next} onBack={back} />}
      </SceneWrapper>
    </div>
  );
};

export default Block5;
