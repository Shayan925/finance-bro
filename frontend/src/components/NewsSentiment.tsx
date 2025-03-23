import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

interface NewsArticle {
  title: string;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  summary: string;
  url: string;
}

interface NewsSentimentProps {
  symbol: string;
  articles: NewsArticle[];
  overallSentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
}

export function NewsSentiment({ symbol, articles, overallSentiment, sentimentScore }: NewsSentimentProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      case 'neutral':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="w-4 h-4" />;
      case 'negative':
        return <ThumbsDown className="w-4 h-4" />;
      case 'neutral':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {symbol} News Sentiment
          <span className={getSentimentColor(overallSentiment)}>
            {getSentimentIcon(overallSentiment)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Overall Sentiment:</span>
            <span className={`font-bold ${getSentimentColor(overallSentiment)}`}>
              {overallSentiment.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Sentiment Score:</span>
            <span className="font-bold">{sentimentScore.toFixed(2)}</span>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Recent Articles:</h4>
            <div className="space-y-4">
              {articles.map((article, index) => (
                <div key={index} className="border-b pb-4 last:border-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-medium">{article.title}</h5>
                      <p className="text-sm text-muted-foreground">{article.source}</p>
                    </div>
                    <span className={getSentimentColor(article.sentiment)}>
                      {getSentimentIcon(article.sentiment)}
                    </span>
                  </div>
                  <p className="text-sm mt-2">{article.summary}</p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline mt-2 inline-block"
                  >
                    Read more
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 