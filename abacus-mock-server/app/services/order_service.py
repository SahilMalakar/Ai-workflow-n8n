from sqlalchemy.orm import Session
from app.models import OrderModel, CustomerModel
from app.schemas import OrderResponse
from app.utils.helpers import get_record_or_404, apply_partial_update


def list_orders(db: Session, limit: int, offset: int):
    total = db.query(OrderModel).count()
    orders = db.query(OrderModel).offset(offset).limit(limit).all()

    return {
        "items": [OrderResponse.model_validate(o).model_dump() for o in orders],
        "total": total,
        "limit": limit,
        "offset": offset,
    }


def get_order(db: Session, order_id: str):
    order = get_record_or_404(db, OrderModel, order_id)
    return OrderResponse.model_validate(order).model_dump()


def create_order(db: Session, payload):
    get_record_or_404(db, CustomerModel, payload.customerId)

    new_order = OrderModel(**payload.model_dump())
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return OrderResponse.model_validate(new_order).model_dump()


def update_order(db: Session, order_id: str, payload):
    order = get_record_or_404(db, OrderModel, order_id)
    apply_partial_update(order, payload.model_dump(exclude_unset=True))
    db.commit()
    db.refresh(order)
    return OrderResponse.model_validate(order).model_dump()


def delete_order(db: Session, order_id: str):
    order = get_record_or_404(db, OrderModel, order_id)
    db.delete(order)
    db.commit()
