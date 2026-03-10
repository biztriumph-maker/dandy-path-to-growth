import { ChevronLeft } from "lucide-react";
import { useDandyIsTyping } from "../hooks/use-dandy";

function scrollAllToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  const root = document.getElementById('root');
  if (root) root.scrollTop = 0;
}

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel: string;
  backLabel: string;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  showBack?: boolean;
}

const NavigationButtons = ({
  onBack,
  onNext,
  nextLabel,
  backLabel,
  nextDisabled = false,
  backDisabled = false,
  showBack = true,
}: NavigationButtonsProps) => {
  const isDandyTyping = useDandyIsTyping();
  const effectivelyDisabled = nextDisabled || isDandyTyping;
  const backEffectivelyDisabled = backDisabled || isDandyTyping;

  return (
    <div className="flex items-center gap-3 px-4 sm:px-5 md:px-6 py-4 mt-auto bg-background/80 backdrop-blur-sm border-t border-border/50">
      {showBack && onBack ? (
        <button
          type="button"
          className={`flex items-center gap-1 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full font-semibold text-sm sm:text-base transition-all shadow-soft ${
            backEffectivelyDisabled
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95"
          }`}
          onClick={() => {
            if (!backEffectivelyDisabled && onBack) {
              scrollAllToTop();
              onBack();
            }
          }}
        >
          <ChevronLeft className="w-4 h-4" />
          {backLabel}
        </button>
      ) : (
        <div />
      )}

      <button
        type="button"
        className={`flex-1 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full font-bold text-base sm:text-lg transition-all active:scale-95 ${
          effectivelyDisabled
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "gradient-primary text-primary-foreground shadow-button hover:opacity-90"
        }`}
        onClick={() => {
          if (!effectivelyDisabled && onNext) {
            scrollAllToTop();
            onNext();
          }
        }}
      >
        {nextLabel}
      </button>
    </div>
  );
};

export default NavigationButtons;
