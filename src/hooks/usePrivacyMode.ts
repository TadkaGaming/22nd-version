import { useGlobalFilters } from '@/contexts/GlobalFiltersContext';
import { useMemo, useCallback } from 'react';

/**
 * Privacy Mode Hook
 * 
 * When Privacy mode is active (global display filter = 'privacy'), certain metrics
 * are masked with "**" to hide sensitive financial information.
 * 
 * Masked metrics:
 * - Return ($) / Net P&L / Gross P&L
 * - Return (%)
 * - Profit Factor
 * 
 * Always visible metrics:
 * - Winrate, Day Winrate
 * - Winners/Losers/BE counts
 * - Trade count
 * - Holding time / Duration
 * - RRR / R-Multiple
 */

export const PRIVACY_MASK = '**';

export const usePrivacyMode = () => {
  const { displayMode } = useGlobalFilters();
  
  const isPrivacyMode = displayMode === 'privacy';
  
  /**
   * Mask a currency/dollar value
   * Returns "**" if privacy mode is active, otherwise returns the formatted value
   */
  const maskCurrency = useCallback((
    value: number,
    formatter: (val: number, showSign?: boolean) => string,
    showSign?: boolean
  ): string => {
    if (isPrivacyMode) return PRIVACY_MASK;
    return formatter(value, showSign);
  }, [isPrivacyMode]);
  
  /**
   * Mask a percentage value
   * Returns "**" if privacy mode is active, otherwise returns the formatted percentage
   */
  const maskPercent = useCallback((
    value: number,
    decimals: number = 2
  ): string => {
    if (isPrivacyMode) return PRIVACY_MASK;
    return `${value.toFixed(decimals)}%`;
  }, [isPrivacyMode]);
  
  /**
   * Mask a profit factor value
   * Returns "**" if privacy mode is active, otherwise returns the formatted value
   */
  const maskProfitFactor = useCallback((
    value: number,
    decimals: number = 2
  ): string => {
    if (isPrivacyMode) return PRIVACY_MASK;
    if (value === Infinity) return '∞';
    return value.toFixed(decimals);
  }, [isPrivacyMode]);
  
  /**
   * Mask a raw numeric value (for Return $ amounts without currency formatting)
   * Returns "**" if privacy mode is active, otherwise returns formatted number
   */
  const maskNumber = useCallback((
    value: number,
    decimals: number = 2,
    prefix: string = '',
    suffix: string = ''
  ): string => {
    if (isPrivacyMode) return PRIVACY_MASK;
    const sign = value >= 0 ? '' : '-';
    return `${sign}${prefix}${Math.abs(value).toFixed(decimals)}${suffix}`;
  }, [isPrivacyMode]);
  
  /**
   * Get the value or mask based on privacy mode
   * Use for displaying in components - returns the actual value for computation but "**" for display
   */
  const getDisplayValue = useCallback(<T extends string | number>(
    value: T,
    formatter?: (val: T) => string
  ): string => {
    if (isPrivacyMode) return PRIVACY_MASK;
    if (formatter) return formatter(value);
    return String(value);
  }, [isPrivacyMode]);
  
  /**
   * Check if a metric type should be masked
   */
  const shouldMaskMetric = useCallback((metricType: 'return' | 'returnPercent' | 'profitFactor' | 'other'): boolean => {
    if (!isPrivacyMode) return false;
    return metricType === 'return' || metricType === 'returnPercent' || metricType === 'profitFactor';
  }, [isPrivacyMode]);
  
  return {
    isPrivacyMode,
    maskCurrency,
    maskPercent,
    maskProfitFactor,
    maskNumber,
    getDisplayValue,
    shouldMaskMetric,
    PRIVACY_MASK,
  };
};
