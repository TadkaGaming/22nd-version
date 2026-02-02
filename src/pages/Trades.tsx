import { motion } from 'framer-motion';
import { Pencil, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useFilteredTrades } from '@/hooks/useFilteredTrades';
import { useTradeModal } from '@/contexts/TradeModalContext';
import { useGlobalFilters } from '@/contexts/GlobalFiltersContext';
import { usePrivacyMode } from '@/hooks/usePrivacyMode';
import { calculateTradeMetrics } from '@/types/trade';
import { cn } from '@/lib/utils';
import { WinRateGauge } from '@/components/dashboard/WinRateGauge';
import { ProfitFactorRing } from '@/components/dashboard/ProfitFactorRing';
import { AvgWinLossRatio } from '@/components/dashboard/AvgWinLossRatio';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

const Trades = () => {
  const { filteredTrades, deleteTrade, stats } = useFilteredTrades();
  const { openModal } = useTradeModal();
  const { formatCurrency, currencyConfig } = useGlobalFilters();
  const { isPrivacyMode, maskCurrency } = usePrivacyMode();

  const sortedTrades = [...filteredTrades].sort((a, b) => {
    const metricsA = calculateTradeMetrics(a);
    const metricsB = calculateTradeMetrics(b);
    return new Date(metricsB.closeDate || 0).getTime() - new Date(metricsA.closeDate || 0).getTime();
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Net P&L with Total Trades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0 }}
          className="glass-card rounded-xl px-4 py-3"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs text-muted-foreground">Net P&L</span>
            <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
              {stats.totalTrades}
            </span>
          </div>
          <p className={`text-2xl font-bold font-mono ${isPrivacyMode ? 'text-foreground' : stats.netPnl >= 0 ? 'profit-text' : 'loss-text'}`}>
            {maskCurrency(stats.netPnl, formatCurrency)}
          </p>
        </motion.div>

        {/* Trade Win Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card rounded-xl px-4 py-3"
        >
          <WinRateGauge 
            value={stats.tradeWinRate} 
            label="Trade Win %"
            winners={stats.winningTrades}
            losers={stats.losingTrades}
            breakeven={stats.breakevenTrades}
          />
        </motion.div>

        {/* Profit Factor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card rounded-xl px-4 py-3"
        >
          <ProfitFactorRing 
            profitFactor={stats.profitFactor}
            totalProfits={stats.totalProfits}
            totalLosses={stats.totalLosses}
          />
        </motion.div>

        {/* Day Win Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass-card rounded-xl px-4 py-3"
        >
          <WinRateGauge 
            value={stats.dayWinRate} 
            label="Day Win %"
            winners={stats.winningDays}
            losers={stats.losingDays}
            breakeven={stats.breakevenDays}
          />
        </motion.div>

        {/* Avg Win/Loss Ratio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="glass-card rounded-xl px-4 py-3"
        >
          <AvgWinLossRatio 
            avgWin={stats.avgWin}
            avgLoss={stats.avgLoss}
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        {sortedTrades.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No trades recorded yet</p>
            <p className="text-sm mt-1">Click "Enter Trade" or the + button to add your first trade</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Symbol</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Open Date</TableHead>
                <TableHead>Close Date</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Gross P&L</TableHead>
                <TableHead>Net P&L</TableHead>
                <TableHead>R Factor</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTrades.map((trade, index) => {
                const metrics = calculateTradeMetrics(trade);
                return (
                  <motion.tr
                    key={trade.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="border-border hover:bg-secondary/30"
                  >
                    <TableCell className="font-semibold">{trade.symbol}</TableCell>
                    <TableCell>
                      <div className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                        trade.side === 'LONG' ? "bg-profit/20 profit-text" : "bg-loss/20 loss-text"
                      )}>
                        {trade.side === 'LONG' ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {trade.side}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {metrics.openDate ? format(new Date(metrics.openDate), 'MMM dd, yyyy HH:mm') : '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {metrics.closeDate ? format(new Date(metrics.closeDate), 'MMM dd, yyyy HH:mm') : '-'}
                    </TableCell>
                    <TableCell className="font-mono">{metrics.totalQuantity}</TableCell>
                    <TableCell className={cn(
                      "font-mono font-semibold",
                      isPrivacyMode ? "text-foreground" : metrics.grossPnl >= 0 ? "profit-text" : "loss-text"
                    )}>
                      {maskCurrency(metrics.grossPnl, formatCurrency)}
                    </TableCell>
                    <TableCell className={cn(
                      "font-mono font-semibold",
                      isPrivacyMode ? "text-foreground" : metrics.netPnl >= 0 ? "profit-text" : "loss-text"
                    )}>
                      {maskCurrency(metrics.netPnl, formatCurrency)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {trade.savedRMultiple !== undefined && trade.savedRMultiple !== null 
                        ? trade.savedRMultiple.toFixed(2) 
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {trade.tags.slice(0, 2).map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {trade.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{trade.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openModal(trade)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-loss"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Trade</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this trade? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteTrade(trade.id)}
                                className="bg-loss hover:bg-loss/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        )}
      </motion.div>
    </div>
  );
};

export default Trades;
