from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_database_session
from app.utils.auth import verify_bearer_token
from app.utils.responses import success_response
from app.services import project_service
from app.schemas import ProjectCreate, ProjectUpdate

router = APIRouter()


@router.get("/")
def list_projects(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    data = project_service.list_projects(db, limit, offset)
    return success_response(data)


@router.get("/{project_id}")
def get_project(
    project_id: str,
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    data = project_service.get_project(db, project_id)
    return success_response(data)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    data = project_service.create_project(db, payload)
    return success_response(data)


@router.patch("/{project_id}")
def update_project(
    project_id: str,
    payload: ProjectUpdate,
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    data = project_service.update_project(db, project_id, payload)
    return success_response(data)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: str,
    db: Session = Depends(get_database_session),
    token: str = Depends(verify_bearer_token),
):
    project_service.delete_project(db, project_id)
