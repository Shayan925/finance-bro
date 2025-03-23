from sqlalchemy.orm import Session
from app.db.models import Analysis
from typing import Optional, Dict, Any
from datetime import datetime

class AnalysisRepository:
    """
    Handles the analysis repository for the application.
    db: Session = The database session
    """
    def __init__(self, db: Session):
        self.db = db

    # Create a new analysis in the database
    def create_analysis(
        self, 
        analysis_id: str, 
        stock_data: list[Dict[str, Any]], 
        technical_metrics: Dict[str, Any],
        fundamental_metrics: Dict[str, Any],
        analysis_text: Dict[str, Any]
    ) -> Analysis:
        db_analysis = Analysis(
            id=analysis_id,
            stock_data=stock_data,
            technical_metrics=technical_metrics,
            fundamental_metrics=fundamental_metrics,
            analysis_text=analysis_text,
            timestamp=datetime.now()
        )
        # Add the analysis to the database
        self.db.add(db_analysis)
        # Commit the changes to the database
        self.db.commit()
        # Refresh the analysis object to get the latest data from the database
        self.db.refresh(db_analysis)
        return db_analysis

    # Get an analysis from the database
    def get_analysis(self, analysis_id: str) -> Optional[Analysis]:
        return self.db.query(Analysis).filter(Analysis.id == analysis_id).first() 
    
    # Delete an analysis from the database
    def delete_analysis(self, analysis_id: str) -> None:
        self.db.query(Analysis).filter(Analysis.id == analysis_id).delete()
        self.db.commit()
