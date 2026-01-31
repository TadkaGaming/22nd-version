import { useFilteredTrades } from '@/hooks/useFilteredTrades';
import { useGlobalFilters } from '@/contexts/GlobalFiltersContext';
import { usePrivacyMode } from '@/hooks/usePrivacyMode';
import { calculateTradeMetrics, Trade } from '@/types/trade';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useTradeModal } from '@/contexts/TradeModalContext';

interface DiaryTradeSummaryProps {
  trade: Trade;
}

export const DiaryTradeSummary = ({ trade }: DiaryTradeSummaryProps) => {
  const { formatCurrency } = useGlobalFilters();
  const { isPrivacyMode, maskCurrency, maskPercent } = usePrivacyMode();
  const { openModal } = useTradeModal();
  
  const metrics = calculateTradeMetrics(trade);
  const netPnl = metrics.netPnl;
  const grossPnl = metrics.grossPnl;
  const volume = metrics.totalQuantity;
  const commissions = metrics.totalCharges;
  
  // Use saved return percent - this is the authoritative value
  // Return % = (Net P&L / Account Balance at Trade Time) × 100
  // savedReturnPercent is calculated once at trade creation and stored persistently
  const netRoi: string = trade.savedReturnPercent !== undefined 
    ? trade.savedReturnPercent.toFixed(2)
    : '–'; // Show dash for legacy trades without savedReturnPercent

  // Count CFDs traded (number of entry trades)
  const cfdsTraded = trade.scaleEntries?.length || 
    trade.entries.filter(e => 
      (trade.side === 'LONG' && e.type === 'BUY') || 
      (trade.side === 'SHORT' && e.type === 'SELL')
    ).length || 0;

  return (
    <div className="border border-border/50 rounded-lg p-4 bg-muted/20">
      <div className="flex items-center justify-between mb-4">
        <div className={`text-lg font-semibold ${isPrivacyMode ? 'text-foreground' : netPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
          Net P&L {maskCurrency(netPnl, (v) => `${v >= 0 ? '' : '-'}$${Math.abs(v).toFixed(2)}`)}
        </div>
        <Button
          variant="default"
          size="sm"
          className="gap-2"
          onClick={() => openModal(trade)}
        >
          View trade details
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Cfds traded</div>
          <div className="text-sm font-medium">{cfdsTraded}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Volume</div>
          <div className="text-sm font-medium">{volume}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Commissions</div>
          <div className="text-sm font-medium">{maskCurrency(commissions, formatCurrency)}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Net ROI</div>
          <div className="text-sm font-medium">
            {netRoi === '–' ? '–' : maskPercent(parseFloat(netRoi))}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Gross P&L</div>
          <div className="text-sm font-medium">{maskCurrency(grossPnl, formatCurrency)}</div>
        </div>
      </div>
    </div>
  );
};
