import { Language } from "../lib/i18n";

interface LanguageSwitcherProps {
  current: Language;
  onChange: (lang: Language) => void;
}

const languages: Language[] = ["ru", "kz", "uz", "en", "ua"];

const LanguageSwitcher = ({ current, onChange }: LanguageSwitcherProps) => {
  return (
    <div className="flex gap-1 bg-secondary/80 rounded-full p-1">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase transition-all ${
            current === lang
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
