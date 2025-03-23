import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface TradingSignalProps {
  symbol: string;
  signal: 'buy' | 'sell' | 'hold';
  confidence: number;
  indicators: {
    rsi: number;
    macd: number;
    ma20: number;
    ma50: number;
  };
}

export function TradingSignal({ symbol, signal, confidence, indicators }: TradingSignalProps) {
  const getSignalColor = () => {
    switch (signal) {
      case 'buy':
        return 'text-green-500';
      case 'sell':
        return 'text-red-500';
      case 'hold':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getSignalIcon = () => {
    switch (signal) {
      case 'buy':
        return <ArrowUp className="w-6 h-6" />;
      case 'sell':
        return <ArrowDown className="w-6 h-6" />;
      case 'hold':
        return <Minus className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {symbol} Trading Signal
          <span className={getSignalColor()}>
            {getSignalIcon()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Signal:</span>
            <span className={`font-bold ${getSignalColor()}`}>
              {signal.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Confidence:</span>
            <span className="font-bold">{confidence}%</span>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Technical Indicators:</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-sm text-gray-500">RSI:</span>
                <span className="ml-2">{indicators.rsi.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">MACD:</span>
                <span className="ml-2">{indicators.macd.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">20-day MA:</span>
                <span className="ml-2">{indicators.ma20.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">50-day MA:</span>
                <span className="ml-2">{indicators.ma50.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 