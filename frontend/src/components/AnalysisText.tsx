import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Brain, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

interface AnalysisInsight {
  type: 'bullish' | 'bearish' | 'neutral' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  supportingData?: string[];
  recommendations?: string[];
}

interface AnalysisTextProps {
  symbol: string;
  insights: AnalysisInsight[];
  marketContext: string;
  riskFactors: string[];
  opportunities: string[];
  summary: string;
}

export function AnalysisText({
  symbol,
  insights,
  marketContext,
  riskFactors,
  opportunities,
  summary
}: AnalysisTextProps) {
  const getInsightColor = (type: string) => {
    switch (type) {
      case 'bullish':
        return 'text-green-500';
      case 'bearish':
        return 'text-red-500';
      case 'neutral':
        return 'text-yellow-500';
      case 'opportunity':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'bullish':
        return <TrendingUp className="w-5 h-5" />;
      case 'bearish':
        return <AlertTriangle className="w-5 h-5" />;
      case 'neutral':
        return <Brain className="w-5 h-5" />;
      case 'opportunity':
        return <Lightbulb className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          AI Analysis for {symbol}
          <Brain className="w-5 h-5" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Market Context */}
          <div>
            <h4 className="font-medium mb-2">Market Context</h4>
            <p className="text-sm text-muted-foreground">{marketContext}</p>
          </div>

          {/* Key Insights */}
          <div>
            <h4 className="font-medium mb-2">Key Insights</h4>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={getInsightColor(insight.type)}>
                      {getInsightIcon(insight.type)}
                    </span>
                    <h5 className="font-medium">{insight.title}</h5>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {insight.confidence}% confidence
                    </span>
                  </div>
                  <p className="text-sm mb-2">{insight.description}</p>
                  {insight.supportingData && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">Supporting Data:</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {insight.supportingData.map((data, i) => (
                          <li key={i}>{data}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {insight.recommendations && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">Recommendations:</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {insight.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Risk Factors */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              Risk Factors
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {riskFactors.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              Opportunities
              <Lightbulb className="w-4 h-4 text-blue-500" />
            </h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {opportunities.map((opportunity, index) => (
                <li key={index}>{opportunity}</li>
              ))}
            </ul>
          </div>

          {/* Summary */}
          <div>
            <h4 className="font-medium mb-2">Summary</h4>
            <p className="text-sm text-muted-foreground">{summary}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
