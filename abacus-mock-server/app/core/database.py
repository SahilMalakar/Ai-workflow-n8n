from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings

# SQLite needs check_same_thread=False for FastAPI's threading model
if "sqlite" in settings.DATABASE_URL:
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=settings.DEBUG,
    )
else:
    engine = create_engine(settings.DATABASE_URL, echo=settings.DEBUG)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_database_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def initialize_database():
    from app import models  # noqa: F401 — ensures models are registered
    Base.metadata.create_all(bind=engine)
