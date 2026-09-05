from typing import Any

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session


def get_or_404(db: Session, model, item_id: int):
    item = db.get(model, item_id)
    if item is None:
        raise HTTPException(status_code=404, detail=f"{model.__name__} not found")
    return item


def create(db: Session, model, data: dict[str, Any]):
    item = model(**data)
    try:
        db.add(item)
        db.commit()
        db.refresh(item)
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(status_code=409, detail="The data conflicts with an existing record") from error
    return item


def update(db: Session, item, data: dict[str, Any]):
    try:
        for key, value in data.items():
            setattr(item, key, value)
        db.commit()
        db.refresh(item)
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(status_code=409, detail="The update conflicts with an existing record") from error
    return item


def delete(db: Session, item) -> None:
    db.delete(item)
    db.commit()


def page(db: Session, model, page_number: int, page_size: int):
    total = db.scalar(select(func.count()).select_from(model)) or 0
    items = db.scalars(select(model).offset((page_number - 1) * page_size).limit(page_size)).all()
    return {"items": items, "total": total, "page": page_number, "page_size": page_size}
