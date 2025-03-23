from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
import uuid
import logging
from datetime import datetime
from sqlalchemy.orm import Session

from app.services.stock_service import StockService
from app.services.ai_service import AIService
from app.db.database import get_db
from app.repositories.analysis_repository import AnalysisRepository
from app.api.models import StockAnalysisRequest, StockAnalysisResponse

router = APIRouter()
logger = logging.getLogger(__name__)

# Endpoint to get basic stock data (no input required)
@router.get("")
async def get_stock_endpoint():
    try:
        price_data, stats = StockService.get_stock_data()
        analysis = StockService.generate_analysis_text(stats)
        return {
            "stockData": price_data,
            "analysisText": analysis,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.exception("Error in get_stock_endpoint")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint to analyze a stock based on a user's request
@router.post("", response_model=StockAnalysisResponse)
async def analyze_stock(request: StockAnalysisRequest, db: Session = Depends(get_db)):
    """
    Main endpoint for stock analysis:
    1. Processes natural language query
    2. Retrieves market data and calculates indicators
    3. Generates AI-powered analysis
    4. Stores results in database
    5. Returns formatted response
    """
    try:
        logger.info(f"Analyzing stock with message: {request.message}")
        
        # Get stock data and technical indicators
        price_data, stats = StockService.get_stock_data(request.message)
        logger.debug(f"Got stock data: {stats}")
        
        # Generate AI-powered analysis using DeepSeek
        analysis = await AIService.analyze_message(request.message, stats)
        logger.debug(f"Generated analysis: {analysis}")
        
        # Create unique identifier for sharing/retrieval
        analysis_id = str(uuid.uuid4())
        
        # Persist analysis in database for future reference
        try:
            repository = AnalysisRepository(db)
            repository.create_analysis(
                analysis_id=analysis_id,
                stock_data=price_data,
                technical_metrics=stats['technical'],
                fundamental_metrics=stats['fundamental'],
                analysis_text=analysis
            )
        except Exception as db_error:
            logger.exception("Database error while storing analysis")
            raise HTTPException(status_code=500, detail=f"Database error: {str(db_error)}")
        
        return StockAnalysisResponse(
            stockData=price_data,
            analysisText=analysis,
            shareId=analysis_id
        )
    except Exception as e:
        logger.exception("Error in analyze_stock")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint to retrieve a shared analysis by its ID
@router.get("/share/{analysis_id}")
async def get_shared_analysis(analysis_id: str, db: Session = Depends(get_db)):
    try:
        # Retrieve the analysis from the database
        repository = AnalysisRepository(db)
        analysis = repository.get_analysis(analysis_id)

        # If the analysis is not found, raise a 404 error
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        return {
            "stockData": analysis.stock_data,
            "analysisText": analysis.analysis_text,
            "timestamp": analysis.timestamp.isoformat()
        }
    except Exception as e:
        logger.exception("Error in get_shared_analysis")
        raise HTTPException(status_code=500, detail=str(e)) 
