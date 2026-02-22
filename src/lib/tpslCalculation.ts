import { TpSlRule } from '@/components/settings/TpSlSettings';

const STORAGE_KEY = 'trading-journal-tpsl-rules';

/** Migrate legacy single-account rule to multi-account */
const migrateRule = (raw: any): TpSlRule => {
  if (raw.accountIds && raw.accountNames) return raw as TpSlRule;
  return {
    ...raw,
    accountIds: raw.accountId ? [raw.accountId] : [],
    accountNames: raw.accountName ? [raw.accountName] : [],
  };
};

export function loadTpSlRules(): TpSlRule[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return (JSON.parse(stored) as any[]).map(migrateRule);
  } catch {
    return [];
  }
}

export function findMatchingTpSlRule(
  rules: TpSlRule[],
  accountName: string,
  symbol: string
): TpSlRule | null {
  return rules.find(r => r.accountNames.includes(accountName) && r.symbol === symbol) || null;
}

/**
 * Compute automatic TP/SL prices from a rule, entry price, direction, and tick size.
 * This is the single source of truth used by both TradeModal placeholders and Apply-To.
 */
export function computeAutoTpSl(
  rule: TpSlRule,
  entryPrice: number,
  direction: 'LONG' | 'SHORT',
  tickSize: number
): { tp: number | undefined; sl: number | undefined } {
  let tp: number | undefined;
  let sl: number | undefined;

  if (rule.profitTargetUnit === 'tick' && rule.profitTargetValue > 0) {
    tp = direction === 'LONG'
      ? entryPrice + (rule.profitTargetValue * tickSize)
      : entryPrice - (rule.profitTargetValue * tickSize);
  }
  if (rule.stopLossUnit === 'tick' && rule.stopLossValue > 0) {
    sl = direction === 'LONG'
      ? entryPrice - (rule.stopLossValue * tickSize)
      : entryPrice + (rule.stopLossValue * tickSize);
  }

  return { tp, sl };
}
