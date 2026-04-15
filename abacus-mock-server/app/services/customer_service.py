from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models import CustomerModel
from app.schemas import CustomerResponse
from app.utils.helpers import get_record_or_404, apply_partial_update


def list_customers(db: Session, limit: int, offset: int, search: str | None):
    query = db.query(CustomerModel)

    if search:
        pattern = f"%{search}%"
        query = query.filter(
            CustomerModel.name.ilike(pattern) |
            CustomerModel.email.ilike(pattern)
        )

    total = query.count()
    customers = query.offset(offset).limit(limit).all()

    return {
        "items": [CustomerResponse.model_validate(c).model_dump() for c in customers],
        "total": total,
        "limit": limit,
        "offset": offset,
    }


def get_customer(db: Session, customer_id: str):
    customer = get_record_or_404(db, CustomerModel, customer_id)
    return CustomerResponse.model_validate(customer).model_dump()


def create_customer(db: Session, payload):
    if payload.email:
        existing = db.query(CustomerModel).filter(CustomerModel.email == payload.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Customer with email '{payload.email}' already exists",
            )

    new_customer = CustomerModel(**payload.model_dump())
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return CustomerResponse.model_validate(new_customer).model_dump()


def update_customer(db: Session, customer_id: str, payload):
    customer = get_record_or_404(db, CustomerModel, customer_id)
    apply_partial_update(customer, payload.model_dump(exclude_unset=True))
    db.commit()
    db.refresh(customer)
    return CustomerResponse.model_validate(customer).model_dump()
