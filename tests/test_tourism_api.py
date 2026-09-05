def user_payload(email="visitor@example.com"):
    return {"full_name": "Aseer Visitor", "email": email, "password": "SecurePass123!"}


def destination_payload(name="Rijal Almaa"):
    return {"name_ar": name, "name_en": name, "description": "Heritage village", "category": "heritage", "city": "Rijal Almaa", "latitude": 18.211, "longitude": 42.272}


def test_user_creation_and_duplicate_email(client):
    first = client.post("/api/users", json=user_payload())
    assert first.status_code == 201
    assert "hashed_password" not in first.json()
    assert client.post("/api/users", json=user_payload()).status_code == 409


def test_destination_crud_and_pagination(client):
    created = client.post("/api/destinations", json=destination_payload())
    assert created.status_code == 201
    item_id = created.json()["id"]
    changed = client.patch(f"/api/destinations/{item_id}", json=destination_payload("Al Soudah"))
    assert changed.json()["name_ar"] == "Al Soudah"
    page = client.get("/api/destinations?page=1&page_size=1").json()
    assert page["total"] == 1 and len(page["items"]) == 1
    assert client.delete(f"/api/destinations/{item_id}").status_code == 204


def test_trip_stop_favorite_and_relationships(client):
    user_id = client.post("/api/users", json=user_payload()).json()["id"]
    destination_id = client.post("/api/destinations", json=destination_payload()).json()["id"]
    trip = client.post("/api/trips", json={"user_id": user_id, "title": "Weekend", "start_date": "2026-09-05", "end_date": "2026-09-06", "people_count": 2})
    stop = client.post(f"/api/trips/{trip.json()['id']}/stops", json={"destination_id": destination_id, "visit_date": "2026-09-05", "position": 1})
    assert trip.status_code == 201 and stop.status_code == 201
    assert client.post("/api/favorites", json={"user_id": user_id, "destination_id": destination_id}).status_code == 201
    assert len(client.get("/api/trips").json()[0]["stops"]) == 1


def test_validation(client):
    assert client.post("/api/favorites", json={"user_id": 1}).status_code == 422
    assert client.post("/api/reviews", json={"user_id": 1, "destination_id": 1, "rating": 6}).status_code == 422
