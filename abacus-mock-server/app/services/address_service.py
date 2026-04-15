from sqlalchemy.orm import Session
from app.models import AddressModel
from app.schemas import AddressResponse
from app.utils.helpers import get_record_or_404, apply_partial_update


def list_addresses(db: Session, limit: int, offset: int):
    total = db.query(AddressModel).count()
    items = db.query(AddressModel).offset(offset).limit(limit).all()

    return {
        "items": [AddressResponse.model_validate(i).model_dump() for i in items],
        "total": total,
        "limit": limit,
        "offset": offset,
    }


def get_address(db: Session, address_id: str):
    address = get_record_or_404(db, AddressModel, address_id)
    return AddressResponse.model_validate(address).model_dump()


def create_address(db: Session, payload):
    new = AddressModel(**payload.model_dump())
    db.add(new)
    db.commit()
    db.refresh(new)
    return AddressResponse.model_validate(new).model_dump()


def update_address(db: Session, address_id: str, payload):
    record = get_record_or_404(db, AddressModel, address_id)
    apply_partial_update(record, payload.model_dump(exclude_unset=True))
    db.commit()
    db.refresh(record)
    return AddressResponse.model_validate(record).model_dump()


def delete_address(db: Session, address_id: str):
    record = get_record_or_404(db, AddressModel, address_id)
    db.delete(record)
    db.commit()
