from fastapi import APIRouter, Depends
from app.core.config import settings
from app.utils.auth import verify_bearer_token

router = APIRouter(tags=["System"])


@router.get(f"{settings.api_base_path}/info")
def info(token: str = Depends(verify_bearer_token)):
    return {
        "erp": "Abacus",
        "version": "2025.1",
        "mock_server_status": "Active",
    }
