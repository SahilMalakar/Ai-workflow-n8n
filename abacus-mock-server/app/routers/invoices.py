from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_database_session
from app.utils.auth import verify_bearer_token
from app.utils.responses import success_response
from app.services import invoice_service
from app.schemas import InvoiceCreate, InvoiceUpdate

router = APIRouter()


@router.get("/")
def list_invoices(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    data = invoice_service.list_invoices(db, limit, offset)
    return success_response(data)


@router.get("/{invoice_id}")
def get_invoice(
    invoice_id: str,
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    data = invoice_service.get_invoice(db, invoice_id)
    return success_response(data)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_invoice(
    payload: InvoiceCreate,
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    data = invoice_service.create_invoice(db, payload)
    return success_response(data)


@router.patch("/{invoice_id}")
def update_invoice(
    invoice_id: str,
    payload: InvoiceUpdate,
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    data = invoice_service.update_invoice(db, invoice_id, payload)
    return success_response(data)


@router.delete("/{invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_invoice(
    invoice_id: str,
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    invoice_service.delete_invoice(db, invoice_id)
