from pydantic import BaseModel

class StockAnalysisRequest(BaseModel):
    """
    Handles the request body for the stock analysis endpoint.
    message: str = User's query e.g. "What is the stock price of Apple?"
    """
    message: str

class StockAnalysisResponse(BaseModel):
    """
    Handles the response body for the stock analysis endpoint.
    stockData: list = Stock data e.g. [{"date": "2024-01-01", "price": 100}, {"date": "2024-01-02", "price": 101}]
    analysisText: dict = Analysis text e.g. {"summary": "The stock price of Apple is 100", "recommendation": "Buy the stock"}
    shareId: str = A unique ID for the analysis e.g. "123e4567-e89b-12d3-a456-426614174000"
    """
    stockData: list
    analysisText: dict
    shareId: str 
