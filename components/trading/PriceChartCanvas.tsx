'use client';

import { useEffect, useRef } from 'react';
import {
  AreaSeries,
  ColorType,
  CrosshairMode,
  LineStyle,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from 'lightweight-charts';
import type { Candle, ChartOutcome } from '@/types';

interface PriceChartCanvasProps {
  candles: Candle[];
  currentPrice?: number;
  outcome: ChartOutcome;
}

const OUTCOME_COLORS: Record<ChartOutcome, { line: string; top: string; bottom: string }> = {
  YES: {
    line: '#16a34a',
    top: 'rgba(22, 163, 74, 0.35)',
    bottom: 'rgba(22, 163, 74, 0.02)',
  },
  NO: {
    line: '#dc2626',
    top: 'rgba(220, 38, 38, 0.35)',
    bottom: 'rgba(220, 38, 38, 0.02)',
  },
};

export default function PriceChartCanvas({
  candles,
  currentPrice,
  outcome,
}: PriceChartCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const colors = OUTCOME_COLORS[outcome];

    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: '#0f1419' },
        textColor: '#8b9cb3',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: '#1e2a38' },
        horzLines: { color: '#1e2a38' },
      },
      rightPriceScale: {
        borderColor: '#1e2a38',
        scaleMargins: { top: 0.12, bottom: 0.08 },
      },
      timeScale: {
        borderColor: '#1e2a38',
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        vertLine: { color: '#3b4a5c', labelBackgroundColor: '#1e2a38' },
        horzLine: { color: '#3b4a5c', labelBackgroundColor: '#1e2a38' },
      },
      localization: {
        priceFormatter: (price: number) => `${(price * 100).toFixed(1)}¢`,
      },
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor: colors.line,
      topColor: colors.top,
      bottomColor: colors.bottom,
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: true,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      chart.applyOptions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [outcome]);

  useEffect(() => {
    const series = seriesRef.current;
    const chart = chartRef.current;
    if (!series || !chart || candles.length === 0) return;

    const colors = OUTCOME_COLORS[outcome];

    series.applyOptions({
      lineColor: colors.line,
      topColor: colors.top,
      bottomColor: colors.bottom,
    });

    series.setData(
      candles.map((c) => ({
        time: c.time as UTCTimestamp,
        value: c.close,
      })),
    );

    series.priceLines().forEach((line) => series.removePriceLine(line));

    const lastClose = candles[candles.length - 1]?.close;
    const priceLine = currentPrice ?? lastClose;

    if (priceLine !== undefined) {
      series.createPriceLine({
        price: priceLine,
        color: colors.line,
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: `${(priceLine * 100).toFixed(1)}¢`,
      });
    }

    chart.timeScale().fitContent();
  }, [candles, currentPrice, outcome]);

  return <div ref={containerRef} className="h-full w-full" />;
}
