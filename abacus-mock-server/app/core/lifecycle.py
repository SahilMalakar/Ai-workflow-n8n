import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.database import initialize_database

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting app...")
    initialize_database()
    logger.info("Database initialized")
    yield
    logger.info("Shutting down app...")