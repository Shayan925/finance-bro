import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface MarketSummary {
  date: string;
  marketStatus: 'open' | 'closed';
  majorIndices: {
    name: string;
    value: number;
    change: number;
  }[];
  topMovers: {
    symbol: string;
    name: string;
    price: number;
    change: number;
    volume: number;
  }[];
}

interface DailyReportProps {
  marketSummary: MarketSummary;
  portfolioHighlights: {
    totalValue: number;
    dailyChange: number;
    topPerformers: {
      symbol: string;
      change: number;
    }[];
    underPerformers: {
      symbol: string;
      change: number;
    }[];
  };
  marketInsights: {
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }[];
  tradingOpportunities: {
    symbol: string;
    type: 'buy' | 'sell';
    reason: string;
    confidence: number;
  }[];
  onViewDetails: () => void;
}

export function DailyReport({
  marketSummary,
  portfolioHighlights,
  marketInsights,
  tradingOpportunities,
  onViewDetails
}: DailyReportProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getChangeColor = (value: number) => {
    return value >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Market Summary
            <Calendar className="w-5 h-5" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`font-medium ${
                marketSummary.marketStatus === 'open' ? 'text-green-500' : 'text-red-500'
              }`}>
                {marketSummary.marketStatus.toUpperCase()}
              </span>
              <span className="text-sm text-muted-foreground">
                {new Date(marketSummary.date).toLocaleDateString()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {marketSummary.majorIndices.map((index) => (
                <div key={index.name} className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium">{index.name}</h4>
                  <p className="text-2xl font-bold">{formatCurrency(index.value)}</p>
                  <p className={`font-medium ${getChangeColor(index.change)}`}>
                    {formatPercentage(index.change)}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <h4 className="font-medium mb-2">Top Movers</h4>
              <div className="space-y-2">
                {marketSummary.topMovers.map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div>
                      <span className="font-medium">{stock.symbol}</span>
                      <span className="text-sm text-muted-foreground ml-2">{stock.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={getChangeColor(stock.change)}>
                        {formatPercentage(stock.change)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {stock.volume.toLocaleString()} vol
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Portfolio Highlights
            <DollarSign className="w-5 h-5" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Total Value</h4>
                <p className="text-2xl font-bold">{formatCurrency(portfolioHighlights.totalValue)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Daily Change</h4>
                <p className={`text-2xl font-bold ${getChangeColor(portfolioHighlights.dailyChange)}`}>
                  {formatPercentage(portfolioHighlights.dailyChange)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  Top Performers
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </h4>
                <div className="space-y-2">
                  {portfolioHighlights.topPerformers.map((stock) => (
                    <div key={stock.symbol} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <span className="font-medium">{stock.symbol}</span>
                      <span className="text-green-500">{formatPercentage(stock.change)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  Under Performers
                  <TrendingDown className="w-4 h-4 text-red-500" />
                </h4>
                <div className="space-y-2">
                  {portfolioHighlights.underPerformers.map((stock) => (
                    <div key={stock.symbol} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <span className="font-medium">{stock.symbol}</span>
                      <span className="text-red-500">{formatPercentage(stock.change)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Market Insights
            <Lightbulb className="w-5 h-5" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketInsights.map((insight, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className={getImpactColor(insight.impact)}>
                    {insight.impact.toUpperCase()}
                  </span>
                  <h4 className="font-medium">{insight.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trading Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Trading Opportunities
            <AlertTriangle className="w-5 h-5" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tradingOpportunities.map((opportunity, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {opportunity.type === 'buy' ? (
                      <ArrowUpRight className="w-5 h-5 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-500" />
                    )}
                    <h4 className="font-medium">{opportunity.symbol}</h4>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {opportunity.confidence}% confidence
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{opportunity.reason}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={onViewDetails} className="w-full">
        View Detailed Report
      </Button>
    </div>
  );
} 