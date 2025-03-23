import { supabase } from './supabase';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private async getAuthToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  }

  private async request<T>(
    endpoint: string,
    options: {
      method?: string;
      body?: any;
    } = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const { data, error } = await supabase.functions.invoke(endpoint, {
        method: options.method || 'POST',
        body: options.body,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (error) {
        console.error(`Supabase Function Error (${endpoint}):`, error);
        throw new Error(error.message || 'Failed to process request');
      }

      return { data };
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      return { error: error.message || 'An unexpected error occurred' };
    }
  }

  async sendMessage(message: string): Promise<ApiResponse<{
    stockData: Array<{
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
    analysisText: {
      summary: string;
      technicalFactors: string[];
      fundamentalFactors: string[];
      outlook: string;
      timestamp: string;
    };
    stats: {
      technical: {
        atr: number;
        natr: number;
        obv: number;
        ad_line: number;
        momentum: number;
        roc: number;
      };
    };
    shareId: string;
  }>> {
    console.log('💬 Sending chat message:', {
      message,
      timestamp: new Date().toISOString()
    });
    return this.request('chat', {
      method: 'POST',
      body: { message }
    });
  }

  async getNewsSentiment(symbol: string): Promise<ApiResponse<{
    articles: Array<{
      title: string;
      source: string;
      url: string;
      publishedAt: string;
      sentiment: 'positive' | 'negative' | 'neutral';
      impact: 'high' | 'medium' | 'low';
      summary: string;
    }>;
    overallSentiment: {
      score: number;
      trend: 'up' | 'down' | 'neutral';
      confidence: number;
    };
  }>> {
    return this.request(`/api/news/${symbol}`);
  }

  async getTradingSignal(symbol: string): Promise<ApiResponse<{
    symbol: string;
    signal: 'buy' | 'sell' | 'hold';
    confidence: number;
    priceTarget: number;
    stopLoss: number;
    timeframe: string;
    reasoning: string[];
    technicalIndicators: Array<{
      name: string;
      value: number;
      signal: 'bullish' | 'bearish' | 'neutral';
    }>;
  }>> {
    return this.request(`/api/signal/${symbol}`);
  }

  async getPortfolioRecommendations(userId: string): Promise<ApiResponse<{
    recommendations: Array<{
      symbol: string;
      allocation: number;
      reasoning: string[];
      riskMetrics: {
        beta: number;
        sharpeRatio: number;
        volatility: number;
      };
    }>;
    portfolioMetrics: {
      expectedReturn: number;
      expectedRisk: number;
      diversificationScore: number;
    };
  }>> {
    return this.request(`/api/portfolio/${userId}`);
  }

  async getRealEstateData(location: string): Promise<ApiResponse<{
    marketData: {
      medianPrice: number;
      priceTrend: number;
      daysOnMarket: number;
      inventory: number;
    };
    forecasts: Array<{
      timeframe: string;
      priceChange: number;
      confidence: number;
    }>;
    comparableProperties: Array<{
      address: string;
      price: number;
      beds: number;
      baths: number;
      sqft: number;
      yearBuilt: number;
    }>;
  }>> {
    return this.request(`/api/real-estate/${encodeURIComponent(location)}`);
  }

  async getSharedAnalysis(analysisId: string): Promise<ApiResponse<{
    stockData: any[];
    analysisText: any;
    stats: any;
  }>> {
    return this.request(`analysis/${analysisId}`);
  }

  async saveUserProfile(profile: {
    age: number;
    riskTolerance: number;
    investmentGoal: string;
    timeHorizon: string;
    initialInvestment: number;
    monthlyContribution: number;
    preferredAssetTypes: string[];
  }): Promise<ApiResponse<void>> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    return this.request('profile', {
      method: 'POST',
      body: {
        userId: user.id,
        ...profile
      }
    });
  }

  async getUserProfile(): Promise<ApiResponse<{
    age: number;
    riskTolerance: number;
    investmentGoal: string;
    timeHorizon: string;
    initialInvestment: number;
    monthlyContribution: number;
    preferredAssetTypes: string[];
  }>> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    return this.request('profile');
  }
}

export default new ApiClient(); 