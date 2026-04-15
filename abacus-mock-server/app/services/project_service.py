from sqlalchemy.orm import Session
from app.models import ProjectModel, CustomerModel
from app.schemas import ProjectResponse
from app.utils.helpers import get_record_or_404, apply_partial_update


def list_projects(db: Session, limit: int, offset: int):
    total = db.query(ProjectModel).count()
    projects = db.query(ProjectModel).offset(offset).limit(limit).all()

    return {
        "items": [ProjectResponse.model_validate(p).model_dump() for p in projects],
        "total": total,
        "limit": limit,
        "offset": offset,
    }


def get_project(db: Session, project_id: str):
    project = get_record_or_404(db, ProjectModel, project_id)
    return ProjectResponse.model_validate(project).model_dump()


def create_project(db: Session, payload):
    if payload.customerId:
        get_record_or_404(db, CustomerModel, payload.customerId)

    new_project = ProjectModel(**payload.model_dump())
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return ProjectResponse.model_validate(new_project).model_dump()


def update_project(db: Session, project_id: str, payload):
    project = get_record_or_404(db, ProjectModel, project_id)
    apply_partial_update(project, payload.model_dump(exclude_unset=True))
    db.commit()
    db.refresh(project)
    return ProjectResponse.model_validate(project).model_dump()


def delete_project(db: Session, project_id: str):
    project = get_record_or_404(db, ProjectModel, project_id)
    db.delete(project)
    db.commit()
