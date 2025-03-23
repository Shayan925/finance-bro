from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from typing import Optional, List
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import logging
import sys

from app.core.config import settings
from app.api.endpoints import stock
from app.db.database import engine
from app.db import models


# Load environment variables
load_dotenv()

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="FinanceBro API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_KEY", "")
)

# Security
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        user = supabase.auth.get_user(credentials.credentials)
        return user
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Helper functions
def calculate_technical_indicators(df: pd.DataFrame) -> pd.DataFrame:
    # Calculate moving averages
    df['ma20'] = df['Close'].rolling(window=20).mean()
    df['ma50'] = df['Close'].rolling(window=50).mean()
    df['ma200'] = df['Close'].rolling(window=200).mean()
    
    # Calculate returns
    df['returns'] = df['Close'].pct_change()
    
    return df

def analyze_stock_data(df: pd.DataFrame) -> dict:
    latest = df.iloc[-1]
    prev = df.iloc[-2]
    
    return {
        "currentPrice": latest['Close'],
        "priceChange": latest['Close'] - prev['Close'],
        "volume": latest['Volume'],
        "ma20": latest['ma20'],
        "ma50": latest['ma50'],
        "ma200": latest['ma200'],
        "returns": latest['returns'],
    }

# API Endpoints
@app.get("/api/analyze/{symbol}")
async def analyze_stock(symbol: str, current_user = Depends(get_current_user)):
    try:
        # Fetch stock data
        stock = yf.Ticker(symbol)
        hist = stock.history(period="1y")
        
        if hist.empty:
            raise HTTPException(status_code=404, detail="Stock not found")
        
        # Calculate technical indicators
        df = calculate_technical_indicators(hist)
        
        # Get stock info
        info = stock.info
        
        # Prepare response
        response = {
            "stockData": df.reset_index().to_dict('records'),
            "analysisText": {
                "summary": f"Analysis for {symbol}",
                "technicalFactors": [
                    f"Price is {'above' if df['Close'].iloc[-1] > df['ma20'].iloc[-1] else 'below'} 20-day MA",
                    f"Price is {'above' if df['Close'].iloc[-1] > df['ma50'].iloc[-1] else 'below'} 50-day MA",
                    f"Price is {'above' if df['Close'].iloc[-1] > df['ma200'].iloc[-1] else 'below'} 200-day MA",
                ],
                "fundamentalFactors": [
                    f"Market Cap: ${info.get('marketCap', 0):,.2f}",
                    f"P/E Ratio: {info.get('trailingPE', 0):.2f}",
                    f"Dividend Yield: {info.get('dividendYield', 0)*100:.2f}%",
                ],
                "outlook": "Technical and fundamental analysis suggests...",
                "timestamp": datetime.now().isoformat(),
            },
            "stats": {
                "currentPrice": info.get('currentPrice', 0),
                "priceChange": info.get('regularMarketChange', 0),
                "volume": info.get('regularMarketVolume', 0),
                "marketCap": info.get('marketCap', 0),
                "peRatio": info.get('trailingPE', 0),
                "dividendYield": info.get('dividendYield', 0),
            },
            "shareId": f"{symbol}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
        }
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/news/{symbol}")
async def get_news_sentiment(symbol: str, current_user = Depends(get_current_user)):
    try:
        # In a real application, you would fetch news from a news API
        # and perform sentiment analysis
        return {
            "articles": [
                {
                    "title": f"Sample news article about {symbol}",
                    "source": "Financial News",
                    "url": "https://example.com",
                    "publishedAt": datetime.now().isoformat(),
                    "sentiment": "positive",
                    "impact": "medium",
                    "summary": "This is a sample news article summary.",
                }
            ],
            "overallSentiment": {
                "score": 0.7,
                "trend": "up",
                "confidence": 85,
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/signal/{symbol}")
async def get_trading_signal(symbol: str, current_user = Depends(get_current_user)):
    try:
        # Fetch stock data
        stock = yf.Ticker(symbol)
        hist = stock.history(period="1y")
        
        if hist.empty:
            raise HTTPException(status_code=404, detail="Stock not found")
        
        # Calculate technical indicators
        df = calculate_technical_indicators(hist)
        
        # Generate trading signal based on technical analysis
        latest = df.iloc[-1]
        signal = "hold"
        confidence = 50
        
        if latest['Close'] > latest['ma20'] > latest['ma50']:
            signal = "buy"
            confidence = 80
        elif latest['Close'] < latest['ma20'] < latest['ma50']:
            signal = "sell"
            confidence = 80
        
        return {
            "symbol": symbol,
            "signal": signal,
            "confidence": confidence,
            "priceTarget": latest['Close'] * 1.1 if signal == "buy" else latest['Close'] * 0.9,
            "stopLoss": latest['Close'] * 0.95 if signal == "buy" else latest['Close'] * 1.05,
            "timeframe": "1-3 months",
            "reasoning": [
                f"Price is {'above' if latest['Close'] > latest['ma20'] else 'below'} 20-day MA",
                f"Price is {'above' if latest['Close'] > latest['ma50'] else 'below'} 50-day MA",
                f"Current trend suggests {signal} signal",
            ],
            "technicalIndicators": [
                {
                    "name": "RSI",
                    "value": 65.5,
                    "signal": "bullish",
                },
                {
                    "name": "MACD",
                    "value": 2.3,
                    "signal": "bullish",
                },
            ],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/portfolio/{user_id}")
async def get_portfolio_recommendations(user_id: str, current_user = Depends(get_current_user)):
    try:
        # In a real application, you would fetch the user's profile
        # and generate personalized recommendations
        return {
            "recommendations": [
                {
                    "symbol": "AAPL",
                    "allocation": 0.3,
                    "reasoning": [
                        "Strong technical indicators",
                        "Positive market sentiment",
                        "Good risk-adjusted return potential",
                    ],
                    "riskMetrics": {
                        "beta": 1.2,
                        "sharpeRatio": 1.5,
                        "volatility": 0.25,
                    },
                }
            ],
            "portfolioMetrics": {
                "expectedReturn": 0.12,
                "expectedRisk": 0.15,
                "diversificationScore": 0.85,
            },
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/real-estate/{location}")
async def get_real_estate_data(location: str, current_user = Depends(get_current_user)):
    try:
        # In a real application, you would fetch real estate data
        # from a real estate API
        return {
            "marketData": {
                "medianPrice": 500000,
                "priceTrend": 0.05,
                "daysOnMarket": 30,
                "inventory": 150,
            },
            "forecasts": [
                {
                    "timeframe": "6 months",
                    "priceChange": 0.03,
                    "confidence": 75,
                }
            ],
            "comparableProperties": [
                {
                    "address": "123 Main St",
                    "price": 450000,
                    "beds": 3,
                    "baths": 2,
                    "sqft": 2000,
                    "yearBuilt": 2020,
                }
            ],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Configure logging
logging.basicConfig(
    level=logging.INFO, # Set the logging level to INFO
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', # Set the logging format
    handlers=[
        logging.StreamHandler(sys.stdout), # Log to the console
        logging.FileHandler('app.log') # Log to a file
    ]
)

# Create a logger instance
logger = logging.getLogger(__name__)

# Log the start of the application
logger.info("Starting the application")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
