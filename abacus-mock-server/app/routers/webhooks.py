import uuid
from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas import WebhookCreate, WebhookResponse

router = APIRouter()

# In-memory storage for webhooks (mock)
webhooks_db = []


@router.get("/", response_model=List[WebhookResponse])
def get_webhooks():
    return webhooks_db


@router.post("/", response_model=WebhookResponse, status_code=status.HTTP_201_CREATED)
def create_webhook(webhook: WebhookCreate):
    new_webhook = WebhookResponse(
        id=str(uuid.uuid4()),
        resource=webhook.resource,
        event=webhook.event,
        url=webhook.url
    )
    webhooks_db.append(new_webhook)
    return new_webhook


@router.delete("/{webhook_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_webhook(webhook_id: str):
    global webhooks_db
    initial_len = len(webhooks_db)
    webhooks_db = [w for w in webhooks_db if w.id != webhook_id]
    
    if len(webhooks_db) == initial_len:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    return None
