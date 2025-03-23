from sqlalchemy import Column, String, JSON, DateTime
from datetime import datetime

from .database import Base

class Analysis(Base):
    """
    Handles the analysis model for the database.
    id: str = A unique ID for the analysis e.g. "123e4567-e89b-12d3-a456-426614174000"
    stock_data: list = Stock data e.g. [{"date": "2024-01-01", "price": 100}, {"date": "2024-01-02", "price": 101}]
    technical_metrics: dict = Technical metrics e.g. {"RSI": 50, "MACD": 100}
    fundamental_metrics: dict = Fundamental metrics e.g. {"PE": 10, "EPS": 10}
    analysis_text: dict = Analysis text e.g. {"summary": "The stock price of Apple is 100", "recommendation": "Buy the stock"}
    timestamp: datetime = The timestamp of the analysis e.g. datetime.utcnow()
    """
    __tablename__ = "analyses"

    id = Column(String, primary_key=True)
    stock_data = Column(JSON)
    technical_metrics = Column(JSON)
    fundamental_metrics = Column(JSON)
    analysis_text = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)
