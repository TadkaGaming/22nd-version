import { motion } from 'framer-motion';

interface WinRateGaugeProps {
  value: number;
  label: string;
  winners?: number;
  losers?: number;
}

export const WinRateGauge = ({ value, label, winners, losers }: WinRateGaugeProps) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  const size = 70;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Semi-circle arc (from -110° to 110°, so 220° total)
  const startAngle = -110;
  const endAngle = 110;
  const totalAngle = endAngle - startAngle;
  
  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  };
  
  const describeArc = (cx: number, cy: number, r: number, start: number, end: number) => {
    const startPoint = polarToCartesian(cx, cy, r, start);
    const endPoint = polarToCartesian(cx, cy, r, end);
    const largeArcFlag = Math.abs(end - start) > 180 ? 1 : 0;
    
    return `M ${startPoint.x} ${startPoint.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y}`;
  };
  
  const backgroundPath = describeArc(centerX, centerY, radius, startAngle, endAngle);
  const valueAngle = startAngle + (totalAngle * clampedValue / 100);
  const valuePath = clampedValue > 0 ? describeArc(centerX, centerY, radius, startAngle, valueAngle) : '';
  
  const getValueColor = () => {
    if (clampedValue >= 50) return 'hsl(142, 76%, 36%)';
    if (clampedValue > 0) return 'hsl(0, 84%, 60%)';
    return 'hsl(var(--muted-foreground))';
  };

  const breakeven = winners !== undefined && losers !== undefined ? (winners + losers) - winners - losers : 0;

  return (
    <div className="flex items-center justify-between w-full gap-2">
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-2xl font-bold font-mono">{clampedValue.toFixed(2)}%</span>
        {winners !== undefined && losers !== undefined && (
          <div className="flex items-center gap-2 text-[10px] mt-0.5">
            <span className="profit-text font-medium">{winners}</span>
            <span className="text-muted-foreground">0</span>
            <span className="loss-text font-medium">{losers}</span>
          </div>
        )}
      </div>
      <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`}>
        <path
          d={backgroundPath}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {clampedValue > 0 && (
          <motion.path
            d={valuePath}
            fill="none"
            stroke={getValueColor()}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          />
        )}
      </svg>
    </div>
  );
};
