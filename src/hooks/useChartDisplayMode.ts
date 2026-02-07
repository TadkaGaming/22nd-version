import { useState, useEffect, useRef } from 'react';
import { useGlobalFilters, DisplayMode } from '@/contexts/GlobalFiltersContext';

// Extended chart display type including new options
export type ChartDisplayType = 'dollar' | 'percent' | 'winrate' | 'tradecount' | 'tickpip' | 'privacy' | 'avg_hold_time' | 'longest_duration';

/**
 * Maps the global DisplayMode to a chart-specific DisplayType.
 * This is used ONLY for initial chart defaults, not ongoing sync.
 * 
 * Mapping:
 * - dollar → dollar (Return $)
 * - percentage → percent (Return %)
 * - tickpip → tickpip (Tick / Pip)
 * - privacy → privacy (Privacy)
 */
export const mapGlobalToChartDisplay = (globalMode: DisplayMode): ChartDisplayType => {
  switch (globalMode) {
    case 'dollar':
      return 'dollar';
    case 'percentage':
      return 'percent';
    case 'tickpip':
      return 'tickpip';
    case 'privacy':
      // Privacy removed from chart dropdowns - fall back to dollar
      return 'dollar';
    default:
      return 'dollar';
  }
};

/**
 * Hook for chart display mode that respects global filter as DEFAULT only.
 * 
 * Behavior:
 * - On INITIAL mount: Uses global DisplayMode mapped to chart display type
 * - After mount: Chart state is fully independent from global filter
 * - User changes to chart dropdown are local only
 * - Global filter changes do NOT affect already-mounted charts
 * 
 * @param defaultDisplayType - Fallback default if no global preference
 * @param useGlobalDefault - Whether to use global filter as default (true for left/single charts, false for right charts)
 */
export const useChartDisplayMode = (
  defaultDisplayType: ChartDisplayType = 'dollar',
  useGlobalDefault: boolean = true
) => {
  const { displayMode } = useGlobalFilters();
  const initializedRef = useRef(false);
  
  // Calculate the initial value once
  const getInitialValue = (): ChartDisplayType => {
    if (useGlobalDefault) {
      return mapGlobalToChartDisplay(displayMode);
    }
    return defaultDisplayType;
  };
  
  const [displayType, setDisplayType] = useState<ChartDisplayType>(getInitialValue);
  
  // Only set initial value on first render - never sync afterwards
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
    }
  }, []);
  
  return {
    displayType,
    setDisplayType,
  };
};

/**
 * Get display label for each chart display option
 */
export const getDisplayLabel = (displayType: ChartDisplayType): string => {
  switch (displayType) {
    case 'dollar':
      return 'Return ($)';
    case 'percent':
      return 'Return (%)';
    case 'winrate':
      return 'Winrate (%)';
    case 'tradecount':
      return 'Trade Count';
    case 'tickpip':
      return 'Tick / Pip';
    case 'privacy':
      return 'Privacy';
    case 'avg_hold_time':
      return 'Avg Hold Time';
    case 'longest_duration':
      return 'Longest Duration';
    default:
      return 'Return ($)';
  }
};

/**
 * Format duration in minutes to human-readable string (m/h/d)
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 1) {
    return '<1m';
  }
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }
  if (minutes < 1440) { // Less than 24 hours
    const hours = minutes / 60;
    return `${hours.toFixed(1)}h`;
  }
  // Days
  const days = minutes / 1440;
  return `${days.toFixed(1)}d`;
};

/**
 * Format duration for Y-axis tick (shorter format)
 */
export const formatDurationTick = (minutes: number): string => {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }
  if (minutes < 1440) {
    return `${Math.round(minutes / 60)}h`;
  }
  return `${Math.round(minutes / 1440)}d`;
};
