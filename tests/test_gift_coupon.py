def gift_payload(**overrides):
    payload = {
        "trip_reference": "gift-trip-session-001",
        "recipient": "woman",
        "gift_type": "asir_outfit",
        "size": "M",
        "style": "authentic",
        "pickup_method": "accommodation",
    }
    payload.update(overrides)
    return payload


def test_create_gift_coupon_with_scannable_qr(client):
    response = client.post("/api/gift-coupons", json=gift_payload())
    assert response.status_code == 201
    coupon = response.json()
    assert coupon["code"].startswith("ASIR-GIFT-")
    assert coupon["status"] == "available"
    assert coupon["qr_svg"].startswith("data:image/svg+xml;base64,")


def test_one_coupon_is_reused_for_the_same_trip(client):
    first = client.post("/api/gift-coupons", json=gift_payload()).json()
    second = client.post("/api/gift-coupons", json=gift_payload(gift_type="surprise", size=None, style=None)).json()
    assert second["code"] == first["code"]
    assert second["gift_type"] == first["gift_type"]


def test_coupon_cannot_be_redeemed_twice(client):
    coupon = client.post("/api/gift-coupons", json=gift_payload()).json()
    first = client.post(f"/api/gift-coupons/{coupon['code']}/redeem")
    second = client.post(f"/api/gift-coupons/{coupon['code']}/redeem")
    assert first.status_code == 200
    assert first.json()["status"] == "redeemed"
    assert second.status_code == 409
    assert "مسبقًا" in second.json()["detail"]


def test_asir_outfit_requires_size_and_style(client):
    response = client.post("/api/gift-coupons", json=gift_payload(size=None, style=None))
    assert response.status_code == 422
