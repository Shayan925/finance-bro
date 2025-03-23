import os
from typing import Dict, Any, Optional
import httpx
from dotenv import load_dotenv
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

load_dotenv()

class AIService:
    DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
    DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"
    
    @staticmethod
    def categorize_query(query: str) -> str:
        """Categorize the type of financial data being requested"""
        query = query.lower()
        
        if any(word in query for word in ['stock', 'share', 'equity']):
            return 'stock'
        elif any(word in query for word in ['crypto', 'bitcoin', 'ethereum', 'token']):
            return 'crypto'
        elif any(word in query for word in ['real estate', 'property', 'housing']):
            return 'real_estate'
        elif any(word in query for word in ['news', 'sentiment', 'market']):
            return 'news'
        else:
            return 'general'

    @staticmethod
    async def get_stock_data(symbol: str) -> Dict[str, Any]:
        """Fetch stock data from Yahoo Finance"""
        try:
            stock = yf.Ticker(symbol)
            hist = stock.history(period="1y")
            
            # Calculate technical indicators
            hist['MA20'] = hist['Close'].rolling(window=20).mean()
            hist['MA50'] = hist['Close'].rolling(window=50).mean()
            hist['MA200'] = hist['Close'].rolling(window=200).mean()
            
            # Calculate RSI
            delta = hist['Close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
            rs = gain / loss
            hist['RSI'] = 100 - (100 / (1 + rs))
            
            return {
                'price_data': hist.to_dict('records'),
                'technical_indicators': {
                    'ma20': hist['MA20'].iloc[-1],
                    'ma50': hist['MA50'].iloc[-1],
                    'ma200': hist['MA200'].iloc[-1],
                    'rsi': hist['RSI'].iloc[-1]
                }
            }
        except Exception as e:
            raise ValueError(f"Error fetching stock data: {str(e)}")

    @staticmethod
    async def get_crypto_data(symbol: str) -> Dict[str, Any]:
        """Fetch cryptocurrency data from CoinGecko"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"https://api.coingecko.com/api/v3/coins/{symbol}")
                data = response.json()
                return {
                    'price_data': data['market_data'],
                    'technical_indicators': {
                        'price': data['market_data']['current_price']['usd'],
                        'market_cap': data['market_data']['market_cap']['usd'],
                        'volume_24h': data['market_data']['total_volume']['usd']
                    }
                }
        except Exception as e:
            raise ValueError(f"Error fetching crypto data: {str(e)}")

    @staticmethod
    async def get_real_estate_data(location: str) -> Dict[str, Any]:
        """Fetch real estate data from appropriate API"""
        # Implement real estate API integration
        pass

    @classmethod
    async def analyze_message(cls, message: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Analyze a user message using DeepSeek API"""
        if not cls.DEEPSEEK_API_KEY:
            raise ValueError("DEEPSEEK_API_KEY not found in environment variables")

        # Categorize the query
        query_type = cls.categorize_query(message)
        
        # Fetch relevant data based on query type
        data = None
        if query_type == 'stock':
            # Extract stock symbol from message
            # This is a simple implementation - you might want to use NLP for better extraction
            words = message.split()
            for word in words:
                if word.isupper() and len(word) <= 5:
                    data = await cls.get_stock_data(word)
                    break
        elif query_type == 'crypto':
            # Extract crypto symbol from message
            words = message.split()
            for word in words:
                if word.lower() in ['bitcoin', 'ethereum', 'btc', 'eth']:
                    data = await cls.get_crypto_data(word.lower())
                    break
        elif query_type == 'real_estate':
            # Extract location from message
            # This is a placeholder - implement proper location extraction
            data = await cls.get_real_estate_data("default_location")

        # Prepare the context for the AI
        system_prompt = """You are a financial analysis assistant. Analyze the user's query and provide:
        1. A summary of the analysis
        2. Technical factors affecting the asset
        3. Fundamental factors affecting the asset
        4. A market outlook

        Format your response as a JSON object with these keys:
        {
            "summary": "string",
            "technicalFactors": ["string"],
            "fundamentalFactors": ["string"],
            "outlook": "string"
        }
        """

        # Add context if provided
        if context:
            context_str = "\n".join([f"{k}: {v}" for k, v in context.items()])
            system_prompt += f"\n\nContext:\n{context_str}"
        
        if data:
            data_str = "\n".join([f"{k}: {v}" for k, v in data.items()])
            system_prompt += f"\n\nData:\n{data_str}"

        payload = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            "temperature": 0.7,
            "max_tokens": 1000
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(cls.DEEPSEEK_API_URL, headers={
                "Authorization": f"Bearer {cls.DEEPSEEK_API_KEY}",
                "Content-Type": "application/json"
            }, json=payload)
            response.raise_for_status()
            result = response.json()

            # Extract the AI's response
            ai_message = result["choices"][0]["message"]["content"]
            
            # Parse the JSON response
            try:
                import json
                # Strip markdown code block markers if present
                if "```json" in ai_message:
                    ai_message = ai_message.split("```json")[1].split("```")[0].strip()
                elif "```" in ai_message:
                    ai_message = ai_message.split("```")[1].strip()
                
                analysis = json.loads(ai_message)
                return {
                    **analysis,
                    "data": data,
                    "query_type": query_type
                }
            except json.JSONDecodeError:
                # If the response isn't valid JSON, format it manually
                return {
                    "summary": ai_message,
                    "technicalFactors": [],
                    "fundamentalFactors": [],
                    "outlook": "Unable to parse detailed analysis",
                    "data": data,
                    "query_type": query_type
                } 