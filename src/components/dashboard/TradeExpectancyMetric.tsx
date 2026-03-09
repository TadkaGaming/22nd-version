import { useMemo } from 'react';
import { useFilteredTrades } from '@/hooks/useFilteredTrades';
import { useGlobalFilters } from '@/contexts/GlobalFiltersContext';
import { usePrivacyMode } from '@/hooks/usePrivacyMode';
import { calculateTradeMetrics } from '@/types/trade';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const TradeExpectancyMetric = () => {
  const { filteredTrades } = useFilteredTrades();
  const { classifyTradeOutcome, formatCurrency } = useGlobalFilters();
  const { isPrivacyMode, maskCurrency } = usePrivacyMode();

  const expectancy = useMemo(() => {
    const closedTrades = filteredTrades
      .map(t => ({ trade: t, metrics: calculateTradeMetrics(t) }))
      .filter(({ metrics }) => metrics.positionStatus === 'CLOSED');

    if (closedTrades.length === 0) return 0;

    let winCount = 0;
    let lossCount = 0;
    let totalGrossWins = 0;
    let totalGrossLosses = 0;

    closedTrades.forEach(({ trade, metrics }) => {
      const outcome = classifyTradeOutcome(
        metrics.netPnl,
        trade.savedReturnPercent ?? metrics.returnPercent,
        trade.breakEven
      );

      if (outcome === 'win') {
        winCount++;
        totalGrossWins += metrics.grossPnl;
      } else if (outcome === 'loss') {
        lossCount++;
        totalGrossLosses += Math.abs(metrics.grossPnl);
      }
    });

    const totalWinsAndLosses = winCount + lossCount;
    if (totalWinsAndLosses === 0) return 0;

    const winRate = winCount / totalWinsAndLosses;
    const lossRate = lossCount / totalWinsAndLosses;
    const avgGrossWin = winCount > 0 ? totalGrossWins / winCount : 0;
    const avgGrossLoss = lossCount > 0 ? totalGrossLosses / lossCount : 0;

    return (winRate * avgGrossWin) - (lossRate * avgGrossLoss);
  }, [filteredTrades, classifyTradeOutcome]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-xs text-muted-foreground">Trade expectancy</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 text-muted-foreground/50 cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[220px] text-xs">
              The average amount you can expect to win or lose per trade based on gross margin of closed trades.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className={`text-2xl font-bold font-mono ${isPrivacyMode ? 'text-foreground' : expectancy >= 0 ? 'profit-text' : 'loss-text'}`}>
        {maskCurrency(expectancy, formatCurrency)}
      </p>
    </div>
  );
};
