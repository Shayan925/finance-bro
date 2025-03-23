import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Badge } from "./ui/badge";
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Shield, Target } from 'lucide-react';

interface ResultPageProps {
  stockData?: Array<{
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  returns: number;
  ma20: number;
  ma50: number;
  ma200: number;
  atr: number;
  obv: number;
  ad: number;
  momentum: number;
  roc: number;
  natr: number;
  rsi: number;
  macd: number;
  macd_signal: number;
  bb_upper: number;
  bb_lower: number;
  }>;
  analysisText?: {
    summary: string;
    technicalFactors: string[];
    fundamentalFactors: string[];
    outlook: string;
  timestamp: string;
  };
  shareId?: string;
  stats?: {
    technical: {
      atr: number;
      natr: number;
      obv: number;
      ad_line: number;
      momentum: number;
      roc: number;
    };
  };
  investmentProfile?: {
    age: number;
    riskTolerance: number;
    investmentGoal: string;
    timeHorizon: string;
    initialInvestment: number;
    monthlyContribution: number;
    preferredAssetTypes: string[];
  };
}

export function ResultPage({ 
  stockData = [], 
  analysisText = {
    summary: 'No analysis available',
    technicalFactors: [],
    fundamentalFactors: [],
    outlook: 'No market outlook available',
    timestamp: new Date().toISOString()
  }, 
  shareId,
  stats,
  investmentProfile 
}: ResultPageProps) {
  // Format data for charts
  const formattedData = useMemo(() => {
    if (!stockData || stockData.length === 0) return [];
    
    return stockData.map(d => ({
      ...d,
      date: format(new Date(d.date), 'MMM d'),
      price: Number(d.price.toFixed(2)),
      ma20: Number(d.ma20.toFixed(2)),
      ma50: Number(d.ma50.toFixed(2)),
      ma200: Number(d.ma200.toFixed(2)),
      returns: Number((d.returns * 100).toFixed(2)),
      volume: Number(d.volume.toLocaleString()),
      rsi: Number(d.rsi.toFixed(2)),
      macd: Number(d.macd.toFixed(2)),
      macd_signal: Number(d.macd_signal.toFixed(2)),
      bb_upper: Number(d.bb_upper.toFixed(2)),
      bb_lower: Number(d.bb_lower.toFixed(2))
    }));
  }, [stockData]);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Analysis Summary
            <Target className="w-5 h-5" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{analysisText.summary}</p>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="technical" className="space-y-4">
        <TabsList>
          <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
          <TabsTrigger value="fundamental">Fundamental Analysis</TabsTrigger>
          <TabsTrigger value="sentiment">Market Sentiment</TabsTrigger>
        </TabsList>

        {/* Technical Analysis Tab */}
        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {formattedData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="price" stroke="#8884d8" name="Price" />
                      <Line type="monotone" dataKey="ma20" stroke="#82ca9d" name="MA20" />
                      <Line type="monotone" dataKey="ma50" stroke="#ffc658" name="MA50" />
                      <Line type="monotone" dataKey="ma200" stroke="#ff7300" name="MA200" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No price data available</p>
            </div>
                )}
          </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {stats?.technical ? (
                  Object.entries(stats.technical).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-muted-foreground">{key.toUpperCase()}</span>
                      <span className="font-medium">{value.toFixed(2)}</span>
            </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No technical indicators available</p>
                )}
          </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fundamental Analysis Tab */}
        <TabsContent value="fundamental" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fundamental Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysisText.fundamentalFactors.length > 0 ? (
                  analysisText.fundamentalFactors.map((factor, index) => (
                    <li key={index} className="text-muted-foreground">{factor}</li>
                  ))
                ) : (
                  <li className="text-muted-foreground">No fundamental factors available</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Sentiment Tab */}
        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Outlook</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{analysisText.outlook}</p>
            </CardContent>
          </Card>

          {investmentProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Personalized Insights
                  <Shield className="w-5 h-5" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Risk Profile</h4>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${
                        investmentProfile.riskTolerance > 7 ? 'text-red-500' :
                        investmentProfile.riskTolerance > 4 ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                        {investmentProfile.riskTolerance > 7 ? 'Aggressive' :
                         investmentProfile.riskTolerance > 4 ? 'Moderate' :
                         'Conservative'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        (Risk Score: {investmentProfile.riskTolerance}/10)
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Investment Goals</h4>
                    <p className="text-sm text-muted-foreground">
                      {investmentProfile.investmentGoal} with a {investmentProfile.timeHorizon} time horizon
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Portfolio Size</h4>
                    <p className="text-sm text-muted-foreground">
                      Initial: ${investmentProfile.initialInvestment.toLocaleString()}
                      <br />
                      Monthly: ${investmentProfile.monthlyContribution.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Preferred Assets</h4>
                    <p className="text-sm text-muted-foreground">
                      {investmentProfile.preferredAssetTypes.join(', ')}
                    </p>
        </div>
      </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 