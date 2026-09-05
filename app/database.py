import os
from pathlib import Path
from typing import Generator

from sqlalchemy import create_engine, event, inspect, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

ROOT_DIR = Path(__file__).resolve().parent.parent
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{ROOT_DIR / 'app.db'}")
CONNECT_ARGS = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=CONNECT_ARGS)


if DATABASE_URL.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def enable_sqlite_foreign_keys(dbapi_connection, _):
        dbapi_connection.execute("PRAGMA foreign_keys=ON")
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    with SessionLocal() as session:
        yield session


def initialize_orm_database() -> None:
    """Upgrade the legacy users table, then create the new tables."""
    inspector = inspect(engine)
    if "users" in inspector.get_table_names():
        columns = {column["name"] for column in inspector.get_columns("users")}
        additions = {
            "hashed_password": "VARCHAR(255)",
            "phone": "VARCHAR(30)",
            "updated_at": "DATETIME",
            "is_active": "BOOLEAN NOT NULL DEFAULT 1",
            "is_admin": "BOOLEAN NOT NULL DEFAULT 0",
        }
        with engine.begin() as connection:
            for name, sql_type in additions.items():
                if name not in columns:
                    connection.execute(text(f"ALTER TABLE users ADD COLUMN {name} {sql_type}"))
            connection.execute(text("UPDATE users SET updated_at = created_at WHERE updated_at IS NULL"))
    from app import models  # Register model metadata.
    Base.metadata.create_all(engine)
