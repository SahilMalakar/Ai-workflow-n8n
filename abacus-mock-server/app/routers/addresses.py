from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_database_session
from app.utils.auth import verify_bearer_token
from app.utils.responses import success_response
from app.services import address_service
from app.schemas import AddressCreate, AddressUpdate

router = APIRouter()


@router.get("/")
def list_addresses(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    data = address_service.list_addresses(db, limit, offset)
    return success_response(data)


@router.get("/{address_id}")
def get_address(
    address_id: str,
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    data = address_service.get_address(db, address_id)
    return success_response(data)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_address(
    payload: AddressCreate,
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    data = address_service.create_address(db, payload)
    return success_response(data)


@router.patch("/{address_id}")
def update_address(
    address_id: str,
    payload: AddressUpdate,
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    data = address_service.update_address(db, address_id, payload)
    return success_response(data)


@router.delete("/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_address(
    address_id: str,
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    address_service.delete_address(db, address_id)
