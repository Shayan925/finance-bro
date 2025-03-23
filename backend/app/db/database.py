from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Define the database URL (SQLite in this case)
SQLALCHEMY_DATABASE_URL = "sqlite:///./financebro.db"

# Create the SQLAlchemy engine (core interface for interacting with the database)
# with connect_args={"check_same_thread": False} to avoid SQLite threading issues
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency injection function to get a database session
def get_db():
    db = SessionLocal() # Create a new database session
    try:
        yield db # Yield the database session to the caller
    finally:
        db.close() # Close the database session after the request is finished
