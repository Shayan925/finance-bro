import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Shield } from 'lucide-react';

interface AssetAllocation {
  name: string;
  value: number;
  color: string;
  risk: 'low' | 'medium' | 'high';
  expectedReturn: number;
}

interface PortfolioRecommendationProps {
  userId: string;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  investmentGoal: string;
  timeHorizon: string;
  currentPortfolio: {
    totalValue: number;
    allocation: AssetAllocation[];
  };
  recommendedPortfolio: {
    allocation: AssetAllocation[];
    expectedReturn: number;
    riskScore: number;
  };
  rebalancingSuggestions: {
    asset: string;
    currentPercentage: number;
    recommendedPercentage: number;
    action: 'buy' | 'sell' | 'hold';
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function PortfolioRecommendation({
  userId,
  riskProfile,
  investmentGoal,
  timeHorizon,
  currentPortfolio,
  recommendedPortfolio,
  rebalancingSuggestions
}: PortfolioRecommendationProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Portfolio Recommendation
          <Shield className="w-5 h-5" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Portfolio Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Current Portfolio Value</h4>
              <div className="text-2xl font-bold flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                {currentPortfolio.totalValue.toLocaleString()}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Expected Annual Return</h4>
              <div className="text-2xl font-bold flex items-center gap-2 text-green-500">
                <TrendingUp className="w-5 h-5" />
                {recommendedPortfolio.expectedReturn}%
              </div>
            </div>
          </div>

          {/* Risk Profile */}
          <div>
            <h4 className="font-medium mb-2">Risk Profile</h4>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${getRiskColor(riskProfile)}`}>
                {riskProfile.toUpperCase()}
              </span>
              <span className="text-sm text-muted-foreground">
                (Risk Score: {recommendedPortfolio.riskScore}/10)
              </span>
            </div>
          </div>

          {/* Portfolio Allocation Chart */}
          <div className="h-[300px]">
            <h4 className="font-medium mb-2">Recommended Asset Allocation</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={recommendedPortfolio.allocation}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {recommendedPortfolio.allocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Rebalancing Suggestions */}
          <div>
            <h4 className="font-medium mb-2">Rebalancing Suggestions</h4>
            <div className="space-y-2">
              {rebalancingSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div>
                    <span className="font-medium">{suggestion.asset}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({suggestion.currentPercentage}% → {suggestion.recommendedPercentage}%)
                    </span>
                  </div>
                  <div className={`flex items-center gap-1 ${getActionColor(suggestion.action)}`}>
                    {suggestion.action === 'buy' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : suggestion.action === 'sell' ? (
                      <ArrowDownRight className="w-4 h-4" />
                    ) : null}
                    <span className="font-medium">{suggestion.action.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Investment Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Investment Goal</h4>
              <p className="text-sm text-muted-foreground">{investmentGoal}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Time Horizon</h4>
              <p className="text-sm text-muted-foreground">{timeHorizon}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 