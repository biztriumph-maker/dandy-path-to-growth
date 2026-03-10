import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import SceneWrapper from "../components/SceneWrapper";
import LanguageSwitcher from "../components/LanguageSwitcher";
import NavigationButtons from "../components/NavigationButtons";
import Scene1Welcome from "../scenes/Scene1Welcome";
import Scene2Participate from "../scenes/Scene2Participate";
import Scene3Motivation from "../scenes/Scene3Motivation";
import Scene4Mistakes from "../scenes/Scene4Mistakes";
import Scene5Formula from "../scenes/Scene5Formula";
import Scene6Goal from "../scenes/Scene6Goal";
import { Language, useTranslation } from "../lib/i18n";
import { markBlockComplete } from "../lib/progress";

const TOTAL_SCENES = 6;

const Index = () => {
  const [scene, setScene] = useState(1);
  const [lang, setLang] = useState<Language>(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get("lang") as Language) || "ru";
  });
  const navigate = useNavigate();
  const [participationChoice, setParticipationChoice] = useState<number | null>(null);
  const [motivationChoice, setMotivationChoice] = useState<number | null>(null);
  const [incomeGoal, setIncomeGoal] = useState<string | null>(null);
  const [mistakesDone, setMistakesDone] = useState(false);
  const [completed, setCompleted] = useState(false);

  const t = useTranslation(lang);

  const next = () => {
    setScene((s) => {
      const nextScene = Math.min(s + 1, TOTAL_SCENES);
      // Сбрасываем состояние следующей сцены при переходе вперёд
      if (nextScene === 2) setParticipationChoice(null);
      if (nextScene === 3) setMotivationChoice(null);
      if (nextScene === 4) setMistakesDone(false);
      if (nextScene === 6) setIncomeGoal(null);
      return nextScene;
    });
  };
  const back = () => {
    setScene((s) => {
      const prev = Math.max(s - 1, 1);
      if (prev === 2) setParticipationChoice(null);
      if (prev === 3) setMotivationChoice(null);
      if (prev === 4) setMistakesDone(false);
      if (prev === 6) setIncomeGoal(null);
      return prev;
    });
  };

  const canGoNext = (): boolean => {
    switch (scene) {
      case 2: return participationChoice !== null;
      case 3: return motivationChoice !== null;
      case 4: return mistakesDone;
      case 5: return true;
      case 6: return !!incomeGoal && incomeGoal.length > 0;
      default: return true;
    }
  };

  const handleFinish = () => {
    setCompleted(true);
    markBlockComplete(1);
    if (incomeGoal) {
      localStorage.setItem("dandy_income_goal", incomeGoal);
    }
    setTimeout(() => {
      navigate(`/?lang=${lang}`);
    }, 2500);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto gradient-hero">
      {/* Header with progress and language switcher */}
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex-1">
          {scene > 0 && <ProgressBar current={scene} total={TOTAL_SCENES} t={t} />}
        </div>
        <div className="ml-3 flex-shrink-0">
          <LanguageSwitcher current={lang} onChange={setLang} />
        </div>
      </div>

      <SceneWrapper sceneKey={scene}>
        {scene === 1 && <Scene1Welcome onNext={next} t={t} />}
        {scene === 2 && (
          <Scene2Participate
            onNext={next}
            onBack={back}
            selected={participationChoice}
            onSelect={setParticipationChoice}
            t={t}
          />
        )}
        {scene === 3 && (
          <Scene3Motivation
            selected={motivationChoice}
            onSelect={setMotivationChoice}
            t={t}
          />
        )}
        {scene === 4 && (
          <Scene4Mistakes
            t={t}
            onCorrect={() => setMistakesDone(true)}
          />
        )}
        {scene === 5 && <Scene5Formula t={t} />}
        {scene === 6 && (
          <Scene6Goal
            selected={incomeGoal}
            onSelect={setIncomeGoal}
            t={t}
            completed={completed}
            onFinish={handleFinish}
          />
        )}
      </SceneWrapper>

      {/* Navigation buttons (not on scene 1 or when completed) */}
      {scene > 1 && !completed && (
        <NavigationButtons
          onBack={back}
          onNext={scene === 6 ? handleFinish : next}
          nextLabel={scene === 6 ? t("goal.finish") : t("nav.next")}
          backLabel={t("nav.back")}
          nextDisabled={!canGoNext()}
          showBack={scene > 1}
        />
      )}
    </div>
  );
};

export default Index;
