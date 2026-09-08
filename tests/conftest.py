import os
os.environ["DATABASE_URL"] = "sqlite:///./test_app.db"

import pytest
from fastapi.testclient import TestClient
from app.database import Base, engine
from app.agents.smart_trip import SESSION_STORE
from main import app


@pytest.fixture(autouse=True)
def clean_database():
    SESSION_STORE.clear()
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    yield
    SESSION_STORE.clear()
    Base.metadata.drop_all(engine)


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client
