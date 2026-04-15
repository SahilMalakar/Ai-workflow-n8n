from sqlalchemy.orm import Session
from app.models import InvoiceModel, CustomerModel
from app.schemas import InvoiceResponse
from app.utils.helpers import get_record_or_404, apply_partial_update


def list_invoices(db: Session, limit: int, offset: int):
    total = db.query(InvoiceModel).count()
    invoices = db.query(InvoiceModel).offset(offset).limit(limit).all()

    return {
        "items": [InvoiceResponse.model_validate(i).model_dump() for i in invoices],
        "total": total,
        "limit": limit,
        "offset": offset,
    }


def get_invoice(db: Session, invoice_id: str):
    invoice = get_record_or_404(db, InvoiceModel, invoice_id)
    return InvoiceResponse.model_validate(invoice).model_dump()


def create_invoice(db: Session, payload):
    get_record_or_404(db, CustomerModel, payload.customerId)

    new_invoice = InvoiceModel(**payload.model_dump())
    db.add(new_invoice)
    db.commit()
    db.refresh(new_invoice)
    return InvoiceResponse.model_validate(new_invoice).model_dump()


def update_invoice(db: Session, invoice_id: str, payload):
    invoice = get_record_or_404(db, InvoiceModel, invoice_id)
    apply_partial_update(invoice, payload.model_dump(exclude_unset=True))
    db.commit()
    db.refresh(invoice)
    return InvoiceResponse.model_validate(invoice).model_dump()


def delete_invoice(db: Session, invoice_id: str):
    invoice = get_record_or_404(db, InvoiceModel, invoice_id)
    db.delete(invoice)
    db.commit()
