# FinanceBro: AI-Powered Financial Analysis Agent

FinanceBro is an AI-driven financial analysis platform that leverages LLM capabilities alongside retrieval-augmented generation (RAG) pipelines and agent loops. Designed for financial analysts and up and coming "finance bros" that explains reasoning through natural language processing (NLP) models. The platform integrates real-time data ingestion, technical indicators, and research-driven insights to provides real-time stock analysis, portfolio recommendations, and market insights.


![FinanceBro Screenshot](https://github.com/Shayan925/finance-bro/blob/main/Screenshot.png)




## Features & Functionality
### 🔍 Real-Time Financial Data Integration
- **Stock Market Data** via Yahoo Finance API
- **Cryptocurrency & Meme Coin Data** via DexScreener API
- **Real Estate Market Data** using location-based inputs
- **Financial News Sentiment Analysis** for daily market impact reports

### 🎨 Interactive User Experience
- **AI-Generated Reports**: Daily financial summaries and predictions
- **Technical Analysis Charts**: Interactive visualizations with trend indicators
- **Buy/Sell Recommendations**: AI-backed trading signals
- **Customizable Investment Profile**: Users provide age, risk tolerance, and goals
- **Personalized Research Links**: AI-generated suggestions for further exploration

### 🔒 Secure & Seamless Authentication
- **Supabase Backend** set up for database and authentication
- **Google OAuth Integration** for secure login

| Category       | Technologies                                                                 |
|----------------|-----------------------------------------------------------------------------|
| Frontend       | React, TypeScript, TailwindCSS, Vite                                        |
| Backend        | Supabase, RestAPIs                           |
| Database       | PostgreSQL, SQLite                                                                   |
| Deployment     | Docker, Docker Compose                                                      |

## System Architecture
1. **User inputs investment profile details** (age, risk level, goals, location, etc.)
2. **Chatbot processes queries** and fetches relevant financial data
3. **AI applies sentiment analysis & technical indicators**
4. **Results are displayed** via interactive charts, recommendations, and reports
5. **AI-generated insights are delivered daily** based on financial trends
6. **Secure authentication required** before sending first message

The chatbot will **cite sources and provide research links** where applicable to ensure credibility.

## Future Enhancements
- **Options Trading Support**: AI-generated strategies for derivatives
- **Portfolio Optimization**: Personalized asset allocation suggestions
- **AI Voice Integration**: Voice-enabled chat interactions
- **Social Sentiment Analysis**: Reddit & Twitter finance trends monitoring
- **Expanded Real Estate Insights**: Notifications based on news data that could affect the user's portfolio




