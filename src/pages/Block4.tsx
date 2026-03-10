import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import ProgressBar from "../components/ProgressBar";
import SceneWrapper from "../components/SceneWrapper";
import LanguageSwitcher from "../components/LanguageSwitcher";
import B4Scene1Binary from "../scenes/block4/B4Scene1Binary";
import B4Scene2Calculator from "../scenes/block4/B4Scene2Calculator";
import Block4Test from "../scenes/block4/Block4Test";
import { Language, useTranslation } from "../lib/i18n";
import { markBlockComplete } from "../lib/progress";

const TOTAL_SCENES = 2; // scene-1 (5 steps) + scene-2 (calculator)
const SCENE1_STEPS = 5;
const GLOBAL_TOTAL = SCENE1_STEPS + 1; // scene-1 (5 steps) + scene-2 (calculator)

const Block4 = () => {
  const [scene, setScene] = useState(1);
  const [sceneVisit, setSceneVisit] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(5);
  const [scene1ReturnStep, setScene1ReturnStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [testKey, setTestKey] = useState(0);
  const [lang, setLang] = useState<Language>(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get("lang") as Language) || "ru";
  });

  const t = useTranslation(lang);

  const handleStepChange = useCallback((step: number, total: number) => {
    setCurrentStep(step);
    setTotalSteps(total);
  }, []);

  const goNext = () => {
    if (scene === 1) {
      setSceneVisit((v) => v + 1);
      setScene1ReturnStep(SCENE1_STEPS);
      setScene(2);
      setCurrentStep(1);
      setTotalSteps(1);
    } else if (scene === 2) {
      setCompleted(true);
    }
  };

  const goBack = () => {
    if (scene > 1) { setSceneVisit((v) => v + 1); setScene((s) => s - 1); }
  };

  const handleGoToTest = () => {
    setTestKey((k) => k + 1);
    setShowTest(true);
  };

  const handleTestComplete = () => {
    markBlockComplete(4);
    window.location.href = `/?lang=${lang}`;
  };

  const handleTestBack = () => {
    setShowTest(false);
  };

  // Show test page (separate full-screen, like Block 2)
  if (showTest) {
    return <Block4Test key={testKey} t={t} onComplete={handleTestComplete} onBack={handleTestBack} />;
  }

  // Transition screen: "Блок 4 пройден"
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
              {t("test.b4complete.title")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("test.b4complete.subtitle")}
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
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex-1">
          <ProgressBar
            current={scene === 1 ? currentStep : GLOBAL_TOTAL}
            total={GLOBAL_TOTAL}
            t={t}
          />
        </div>
        <div className="ml-3 flex-shrink-0">
          <LanguageSwitcher current={lang} onChange={setLang} />
        </div>
      </div>

      <SceneWrapper sceneKey={`b4-${scene}-${sceneVisit}`}>
        {scene === 1 && (
          <B4Scene1Binary
            t={t}
            onReady={goNext}
            onStepChange={handleStepChange}
            initialStep={scene1ReturnStep}
          />
        )}
        {scene === 2 && (
          <B4Scene2Calculator
            t={t}
            onReady={goNext}
            onBack={goBack}
          />
        )}
      </SceneWrapper>
    </div>
  );
};

export default Block4;
