import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
  t: (key: string) => string;
}

const ProgressBar = ({ current, total, t }: ProgressBarProps) => {
  const progress = (current / total) * 100;

  return (
    <div className="w-full pt-1 pb-1">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-muted-foreground">
          {t("nav.step")} {current} {t("nav.of")} {total}
        </span>
        <span className="text-sm font-semibold text-primary">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full gradient-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
