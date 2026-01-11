import { motion } from 'framer-motion';

interface ProfitFactorRingProps {
  profitFactor: number;
  totalProfits: number;
  totalLosses: number;
}

export const ProfitFactorRing = ({ 
  profitFactor, 
  totalProfits, 
  totalLosses
}: ProfitFactorRingProps) => {
  const size = 60;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size / 2;
  const circumference = 2 * Math.PI * radius;
  
  const total = totalProfits + Math.abs(totalLosses);
  const profitPercent = total > 0 ? (totalProfits / total) * 100 : 50;
  const lossPercent = 100 - profitPercent;
  
  const profitDash = (profitPercent / 100) * circumference;
  const lossDash = (lossPercent / 100) * circumference;

  return (
    <div className="flex items-center justify-between w-full gap-2">
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">Profit Factor</span>
        <span className="text-2xl font-bold font-mono">
          {profitFactor === Infinity ? '∞' : profitFactor.toFixed(2)}
        </span>
      </div>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="hsl(0, 84%, 60%)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${lossDash} ${circumference}`}
            strokeDashoffset={-profitDash}
            strokeLinecap="round"
          />
          <motion.circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="hsl(142, 76%, 36%)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${profitDash} ${circumference}`}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
      </div>
    </div>
  );
};
