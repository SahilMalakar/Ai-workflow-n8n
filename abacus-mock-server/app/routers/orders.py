from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_database_session
from app.utils.auth import verify_bearer_token
from app.utils.responses import success_response
from app.services import order_service
from app.schemas import OrderCreate, OrderUpdate

router = APIRouter()


@router.get("/")
def list_orders(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    data = order_service.list_orders(db, limit, offset)
    return success_response(data)


@router.get("/{order_id}")
def get_order(
    order_id: str,
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    data = order_service.get_order(db, order_id)
    return success_response(data)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    data = order_service.create_order(db, payload)
    return success_response(data, status_code=201)


@router.patch("/{order_id}")
def update_order(
    order_id: str,
    payload: OrderUpdate,
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    data = order_service.update_order(db, order_id, payload)
    return success_response(data)


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(
    order_id: str,
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    order_service.delete_order(db, order_id)
