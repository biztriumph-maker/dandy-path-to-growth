import { useState } from "react";
import ProgressBar from "../components/ProgressBar";
import SceneWrapper from "../components/SceneWrapper";
import LanguageSwitcher from "../components/LanguageSwitcher";
import NavigationButtons from "../components/NavigationButtons";
import B2Scene1Path from "../scenes/block2/B2Scene1Path";
import B2Scene2Periods from "../scenes/block2/B2Scene2Periods";
import B2Scene3PV from "../scenes/block2/B2Scene3PV";
import B2Scene4PVMoney from "../scenes/block2/B2Scene4PVMoney";
import B2Scene5Packages from "../scenes/block2/B2Scene5Packages";
import B2Scene6Results from "../scenes/block2/B2Scene6Results";
import Block2Test from "../scenes/block2/Block2Test";
import { Language, useTranslation } from "../lib/i18n";
import { markBlockComplete } from "../lib/progress";

const TOTAL_SCENES = 6;

const Block2 = () => {
  const [scene, setScene] = useState(1);
  const [lang, setLang] = useState<Language>(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get("lang") as Language) || "ru";
  });
  const [completed, setCompleted] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [testKey, setTestKey] = useState(0);

  const t = useTranslation(lang);

  const next = () => setScene((s) => Math.min(s + 1, TOTAL_SCENES));
  const back = () => setScene((s) => Math.max(s - 1, 1));

  const handleFinish = () => {
    setCompleted(true);
  };

  const handleGoToTest = () => {
    setTestKey((k) => k + 1);
    setShowTest(true);
  };

  const handleTestComplete = () => {
    markBlockComplete(2);
    window.location.href = `/?lang=${lang}`;
  };

  const handleTestBack = () => {
    setShowTest(false);
  };

  // Show test page
  if (showTest) {
    return <Block2Test key={testKey} t={t} onComplete={handleTestComplete} onBack={handleTestBack} />;
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

      <SceneWrapper sceneKey={`b2-${scene}`}>
        {scene === 1 && <B2Scene1Path t={t} />}
        {scene === 2 && <B2Scene2Periods t={t} />}
        {scene === 3 && <B2Scene3PV t={t} />}
        {scene === 4 && <B2Scene4PVMoney t={t} />}
        {scene === 5 && <B2Scene5Packages t={t} />}
        {scene === 6 && (
          <B2Scene6Results t={t} completed={completed} onGoToTest={handleGoToTest} />
        )}
      </SceneWrapper>

      {/* Navigation */}
      {!completed && (
        <NavigationButtons
          onBack={scene > 1 ? back : undefined}
          onNext={scene === 6 ? handleFinish : next}
          nextLabel={scene === 6 ? t("b2.s6.finish") : t("nav.next")}
          backLabel={t("nav.back")}
          showBack={scene > 1}
        />
      )}
    </div>
  );
};

export default Block2;
