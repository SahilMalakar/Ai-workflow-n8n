from fastapi import HTTPException, status

def get_record_or_404(db, model, record_id):
    record = db.get(model, record_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{model.__name__} not found"
        )
    return record


def apply_partial_update(record, update_data: dict):
    for key, value in update_data.items():
        if value is not None:
            setattr(record, key, value)