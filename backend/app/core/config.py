from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    Handles the configuration for the application.
    """
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "FinanceBro"
    # Cross-Origin Resource Sharing (CORS)
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173"]

settings = Settings() 
