# Plan: FinanceBro AI Investment Analyst

## Overview
FinanceBro is an AI-powered investment assistant designed to provide personalized financial insights, technical analysis, and market sentiment reports. The chatbot interacts with users in a natural conversational manner, similar to DeepSeek, but with a dedicated panel where users can input financial preferences such as age, risk adversity, and investment goals. This enables the chatbot to tailor its recommendations to the user’s profile while integrating live data sources for accurate and up-to-date financial insights.

The AI has been optimized to communicate like a seasoned financial analyst with a high-energy, finance-bro persona, providing engaging, data-driven investment advice.

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

## Tech Stack
### Frontend (React + TypeScript)
Located in `/frontend`
- **Component-based architecture** using ShadCN UI components
- **State management** with Zustand (theme preferences, user settings)
- **Charting** using Recharts & react-chartjs-2 for interactive financial graphs
- **Routing** with React Router DOM

### Backend (Supabase + FastAPI)
Located in `/backend`
- **Database Management** via Supabase
- **Authentication** using Supabase Auth (Google Sign-In)
- **API Integration** with financial data sources (Yahoo Finance, Jup.ag, etc.)
- **Sentiment Analysis** powered by NLP models
- **Technical Analysis Engine** using a TA-Lib equivalent in Python

## System Architecture
1. **User inputs investment profile details** (age, risk level, goals, location, etc.)
2. **Chatbot processes queries** and fetches relevant financial data
3. **AI applies sentiment analysis & technical indicators**
4. **Results are displayed** via interactive charts, recommendations, and reports
5. **AI-generated insights are delivered daily** based on financial trends
6. **Secure authentication required** before sending first message

## Frontend Component Breakdown
```
frontend/
├── components/
│   ├── ui/              # ShadCN UI components
│   ├── Header.tsx       # App header with theme toggle
│   ├── InvestmentPanel.tsx  # User input panel (age, risk, goals, etc.)
│   ├── StockChart.tsx   # Interactive stock price chart with MA toggles
│   ├── TradingSignal.tsx # AI-generated buy/sell recommendations
│   ├── MetricCard.tsx   # Financial metric visualization component
│   ├── AnalysisText.tsx # AI-generated investment insights
│   ├── ShareButton.tsx  # Analysis sharing functionality
│   ├── NewsSentiment.tsx # Market sentiment analysis visualization
│   ├── AuthenticationModal.tsx # Google OAuth sign-in modal
│   ├── Dashboard.tsx     # User dashboard with saved analyses
│   └── DailyReport.tsx   # Personalized daily AI financial summary
├── util/
│   ├── api.ts          # API client for backend communication
│   ├── auth.ts         # Supabase authentication handler
│   ├── theme.ts        # Theme management
│   └── utils.ts        # Utility functions
└── App.tsx             # Main application file
```

## Backend API Endpoints
```
backend/
├── main.py
├── auth/
│   ├── login.py       # Handles OAuth authentication
│   ├── user.py        # User profile management
├── data/
│   ├── stocks.py      # Fetches real-time stock data
│   ├── crypto.py      # Fetches cryptocurrency and meme coin data
│   ├── real_estate.py # Fetches real estate market data
│   ├── news.py        # Retrieves and processes financial news
├── analysis/
│   ├── sentiment.py   # Sentiment analysis module
│   ├── technical.py   # TA-Lib equivalent for stock analysis
│   ├── ai_report.py   # AI-generated financial summaries
├── models/
│   ├── user_model.py  # User profile schema
│   ├── stock_model.py # Stock data schema
│   ├── news_model.py  # News article schema
└── database.py        # Supabase database connection
```

## AI Behavior & Personality
StockChat's AI has been trained to adopt a **finance bro** personality:
- **Confident & Data-Driven**: "Bro, this stock is making waves. RSI is flashing buy—let's make a move!"
- **Engaging & Persuasive**: "You’re in this for the long game? Solid. Let’s talk asset allocation."
- **Results-Oriented**: "Sentiment’s shifting in tech stocks. Time to pivot? Let’s crunch some numbers."
- **Conversational & Friendly**: "Crypto’s wild, my guy. Want a risk-adjusted play? Let’s dive in."

The chatbot will **cite sources and provide research links** where applicable to ensure credibility.

## Future Enhancements
- **Options Trading Support**: AI-generated strategies for derivatives
- **Portfolio Optimization**: Personalized asset allocation suggestions
- **AI Voice Integration**: Voice-enabled chat interactions
- **Social Sentiment Analysis**: Reddit & Twitter finance trends monitoring
- **Expanded Real Estate Insights**: Notifications based on news data that could affect the user's portfolio

## Conclusion
FinanceBro combines **AI-driven analysis**, **real-time data integration**, and **a finance-savvy personality** to create the ultimate investment chatbot. It provides actionable insights backed by financial data, technical indicators, and market sentiment—all while keeping the experience fun and engaging.

