import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  BarChart2, 
  Bookmark, 
  History, 
  Settings, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Bell
} from 'lucide-react';

interface SavedAnalysis {
  id: string;
  symbol: string;
  date: string;
  title: string;
  summary: string;
}

interface PortfolioSnapshot {
  totalValue: number;
  dailyChange: number;
  weeklyChange: number;
  monthlyChange: number;
  holdings: {
    symbol: string;
    shares: number;
    value: number;
    change: number;
  }[];
}

interface DashboardProps {
  savedAnalyses: SavedAnalysis[];
  portfolioSnapshot: PortfolioSnapshot;
  recentActivity: {
    type: 'analysis' | 'trade' | 'alert';
    title: string;
    description: string;
    date: string;
  }[];
  onViewAnalysis: (id: string) => void;
  onViewPortfolio: () => void;
  onViewHistory: () => void;
  onViewSettings: () => void;
}

export function Dashboard({
  savedAnalyses,
  portfolioSnapshot,
  recentActivity,
  onViewAnalysis,
  onViewPortfolio,
  onViewHistory,
  onViewSettings
}: DashboardProps) {
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

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Portfolio Overview
            <DollarSign className="w-5 h-5" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Total Value</h4>
              <p className="text-2xl font-bold">{formatCurrency(portfolioSnapshot.totalValue)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Daily Change</h4>
              <p className={`text-xl font-semibold ${getChangeColor(portfolioSnapshot.dailyChange)}`}>
                {formatPercentage(portfolioSnapshot.dailyChange)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Weekly Change</h4>
              <p className={`text-xl font-semibold ${getChangeColor(portfolioSnapshot.weeklyChange)}`}>
                {formatPercentage(portfolioSnapshot.weeklyChange)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Monthly Change</h4>
              <p className={`text-xl font-semibold ${getChangeColor(portfolioSnapshot.monthlyChange)}`}>
                {formatPercentage(portfolioSnapshot.monthlyChange)}
              </p>
            </div>
          </div>
          <Button onClick={onViewPortfolio} className="mt-4">
            View Full Portfolio
          </Button>
        </CardContent>
      </Card>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="saved" className="space-y-4">
        <TabsList>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            Saved Analyses
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Recent Activity
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Alerts
          </TabsTrigger>
        </TabsList>

        {/* Saved Analyses Tab */}
        <TabsContent value="saved" className="space-y-4">
          {savedAnalyses.map((analysis) => (
            <Card key={analysis.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {analysis.symbol}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewAnalysis(analysis.id)}
                  >
                    View Analysis
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{analysis.summary}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {new Date(analysis.date).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Recent Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          {recentActivity.map((activity, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{activity.title}</h4>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(activity.date).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">No Active Alerts</h4>
                  <p className="text-sm text-muted-foreground">
                    You don't have any active price or portfolio alerts.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Create Alert
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onViewHistory}>
          View History
        </Button>
        <Button variant="outline" onClick={onViewSettings}>
          Settings
        </Button>
      </div>
    </div>
  );
} 