from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_database_session
from app.utils.auth import verify_bearer_token
from app.utils.responses import success_response
from app.services import customer_service
from app.schemas import CustomerCreate, CustomerUpdate

router = APIRouter()


@router.get("/")
def list_customers(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    search: str | None = Query(default=None),
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    data = customer_service.list_customers(db, limit, offset, search)
    return success_response(data)


@router.get("/{customer_id}")
def get_customer(
    customer_id: str,
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    data = customer_service.get_customer(db, customer_id)
    return success_response(data)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_customer(
    payload: CustomerCreate,
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    data = customer_service.create_customer(db, payload)
    return success_response(data)


@router.patch("/{customer_id}")
def update_customer(
    customer_id: str,
    payload: CustomerUpdate,
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    data = customer_service.update_customer(db, customer_id, payload)
    return success_response(data)

# NOTE: No DELETE endpoint for customers — per spec
