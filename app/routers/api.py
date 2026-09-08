import base64
import secrets
from io import BytesIO

import qrcode
import qrcode.image.svg
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app import models, schemas
from app.core.security import hash_password
from app.database import get_db
from app.services import crud

router = APIRouter(prefix="/api")


def gift_coupon_response(coupon: models.GiftCoupon) -> schemas.GiftCouponRead:
    image = qrcode.make(f"ASIR-GIFT:{coupon.code}", image_factory=qrcode.image.svg.SvgPathImage, box_size=8, border=2)
    buffer = BytesIO()
    image.save(buffer)
    qr_svg = "data:image/svg+xml;base64," + base64.b64encode(buffer.getvalue()).decode("ascii")
    return schemas.GiftCouponRead.model_validate({
        "trip_reference": coupon.trip_reference,
        "recipient": coupon.recipient,
        "gift_type": coupon.gift_type,
        "size": coupon.size,
        "style": coupon.style,
        "pickup_method": coupon.pickup_method,
        "code": coupon.code,
        "status": coupon.status,
        "qr_svg": qr_svg,
        "created_at": coupon.created_at,
        "redeemed_at": coupon.redeemed_at,
    })


@router.post("/gift-coupons", response_model=schemas.GiftCouponRead, status_code=201)
def create_gift_coupon(data: schemas.GiftCouponCreate, db: Session = Depends(get_db)):
    existing = db.scalar(select(models.GiftCoupon).where(models.GiftCoupon.trip_reference == data.trip_reference))
    if existing:
        return gift_coupon_response(existing)
    coupon = models.GiftCoupon(**data.model_dump(), code=f"ASIR-GIFT-{secrets.token_hex(3).upper()}")
    db.add(coupon)
    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(status_code=409, detail="تم إنشاء كوبون لهذه الرحلة مسبقًا.") from error
    db.refresh(coupon)
    return gift_coupon_response(coupon)


@router.get("/gift-coupons/trip/{trip_reference}", response_model=schemas.GiftCouponRead)
def get_gift_coupon(trip_reference: str, db: Session = Depends(get_db)):
    coupon = db.scalar(select(models.GiftCoupon).where(models.GiftCoupon.trip_reference == trip_reference))
    if not coupon:
        raise HTTPException(status_code=404, detail="لا يوجد كوبون لهذه الرحلة.")
    return gift_coupon_response(coupon)


@router.post("/gift-coupons/{code}/redeem", response_model=schemas.GiftCouponRead)
def redeem_gift_coupon(code: str, db: Session = Depends(get_db)):
    coupon = db.scalar(select(models.GiftCoupon).where(models.GiftCoupon.code == code))
    if not coupon:
        raise HTTPException(status_code=404, detail="رمز الكوبون غير موجود.")
    if coupon.status == "redeemed":
        raise HTTPException(status_code=409, detail="تم استلام هذه الهدية مسبقًا ولا يمكن استخدام الكوبون مرة أخرى.")
    coupon.status = "redeemed"
    coupon.redeemed_at = models.now_utc()
    db.commit()
    db.refresh(coupon)
    return gift_coupon_response(coupon)


def payload(data):
    values = data.model_dump(exclude_unset=True)
    for key, value in values.items():
        if value.__class__.__name__ == "HttpUrl":
            values[key] = str(value)
    return values


@router.post("/users", response_model=schemas.UserRead, status_code=201)
def create_user(data: schemas.UserCreate, db: Session = Depends(get_db)):
    values = data.model_dump(exclude={"password"})
    values["email"] = str(data.email).lower()
    values["hashed_password"] = hash_password(data.password)
    return crud.create(db, models.User, values)


def paginated(db, model, schema, page, page_size):
    result = crud.page(db, model, page, page_size)
    result["items"] = [schema.model_validate(item).model_dump(mode="json") for item in result["items"]]
    return result


@router.get("/destinations", response_model=schemas.Page)
def destinations(db: Session = Depends(get_db), page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)):
    return paginated(db, models.Destination, schemas.DestinationRead, page, page_size)


@router.post("/destinations", response_model=schemas.DestinationRead, status_code=201)
def add_destination(data: schemas.DestinationCreate, db: Session = Depends(get_db)):
    return crud.create(db, models.Destination, payload(data))


@router.patch("/destinations/{item_id}", response_model=schemas.DestinationRead)
def edit_destination(item_id: int, data: schemas.DestinationCreate, db: Session = Depends(get_db)):
    return crud.update(db, crud.get_or_404(db, models.Destination, item_id), payload(data))


@router.delete("/destinations/{item_id}", status_code=204)
def remove_destination(item_id: int, db: Session = Depends(get_db)):
    crud.delete(db, crud.get_or_404(db, models.Destination, item_id))


@router.get("/accommodations", response_model=schemas.Page)
def accommodations(db: Session = Depends(get_db), page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)):
    return paginated(db, models.Accommodation, schemas.AccommodationRead, page, page_size)


@router.post("/accommodations", response_model=schemas.AccommodationRead, status_code=201)
def add_accommodation(data: schemas.AccommodationCreate, db: Session = Depends(get_db)):
    return crud.create(db, models.Accommodation, payload(data))


@router.patch("/accommodations/{item_id}", response_model=schemas.AccommodationRead)
def edit_accommodation(item_id: int, data: schemas.AccommodationCreate, db: Session = Depends(get_db)):
    return crud.update(db, crud.get_or_404(db, models.Accommodation, item_id), payload(data))


@router.delete("/accommodations/{item_id}", status_code=204)
def remove_accommodation(item_id: int, db: Session = Depends(get_db)):
    crud.delete(db, crud.get_or_404(db, models.Accommodation, item_id))


@router.get("/restaurants", response_model=schemas.Page)
def restaurants(db: Session = Depends(get_db), page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)):
    return paginated(db, models.Restaurant, schemas.RestaurantRead, page, page_size)


@router.post("/restaurants", response_model=schemas.RestaurantRead, status_code=201)
def add_restaurant(data: schemas.RestaurantCreate, db: Session = Depends(get_db)):
    return crud.create(db, models.Restaurant, payload(data))


@router.patch("/restaurants/{item_id}", response_model=schemas.RestaurantRead)
def edit_restaurant(item_id: int, data: schemas.RestaurantCreate, db: Session = Depends(get_db)):
    return crud.update(db, crud.get_or_404(db, models.Restaurant, item_id), payload(data))


@router.delete("/restaurants/{item_id}", status_code=204)
def remove_restaurant(item_id: int, db: Session = Depends(get_db)):
    crud.delete(db, crud.get_or_404(db, models.Restaurant, item_id))


@router.get("/events", response_model=schemas.Page)
def events(db: Session = Depends(get_db), page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)):
    return paginated(db, models.Event, schemas.EventRead, page, page_size)


@router.post("/events", response_model=schemas.EventRead, status_code=201)
def add_event(data: schemas.EventCreate, db: Session = Depends(get_db)):
    return crud.create(db, models.Event, payload(data))


@router.patch("/events/{item_id}", response_model=schemas.EventRead)
def edit_event(item_id: int, data: schemas.EventCreate, db: Session = Depends(get_db)):
    return crud.update(db, crud.get_or_404(db, models.Event, item_id), payload(data))


@router.delete("/events/{item_id}", status_code=204)
def remove_event(item_id: int, db: Session = Depends(get_db)):
    crud.delete(db, crud.get_or_404(db, models.Event, item_id))


@router.get("/trips", response_model=list[schemas.TripRead])
def trips(db: Session = Depends(get_db)):
    return db.scalars(select(models.Trip).options(selectinload(models.Trip.stops))).all()


@router.post("/trips", response_model=schemas.TripRead, status_code=201)
def add_trip(data: schemas.TripCreate, db: Session = Depends(get_db)):
    return crud.create(db, models.Trip, payload(data))


@router.post("/trips/{trip_id}/stops", response_model=schemas.TripStopRead, status_code=201)
def add_trip_stop(trip_id: int, data: schemas.TripStopCreate, db: Session = Depends(get_db)):
    crud.get_or_404(db, models.Trip, trip_id)
    return crud.create(db, models.TripStop, {**payload(data), "trip_id": trip_id})


@router.patch("/trip-stops/{item_id}", response_model=schemas.TripStopRead)
def edit_trip_stop(item_id: int, data: schemas.TripStopCreate, db: Session = Depends(get_db)):
    return crud.update(db, crud.get_or_404(db, models.TripStop, item_id), payload(data))


@router.delete("/trip-stops/{item_id}", status_code=204)
def remove_trip_stop(item_id: int, db: Session = Depends(get_db)):
    crud.delete(db, crud.get_or_404(db, models.TripStop, item_id))


@router.patch("/trips/{item_id}", response_model=schemas.TripRead)
def edit_trip(item_id: int, data: schemas.TripCreate, db: Session = Depends(get_db)):
    return crud.update(db, crud.get_or_404(db, models.Trip, item_id), payload(data))


@router.delete("/trips/{item_id}", status_code=204)
def remove_trip(item_id: int, db: Session = Depends(get_db)):
    crud.delete(db, crud.get_or_404(db, models.Trip, item_id))


@router.get("/favorites", response_model=list[schemas.FavoriteRead])
def favorites(db: Session = Depends(get_db)):
    return db.scalars(select(models.Favorite)).all()


@router.post("/favorites", response_model=schemas.FavoriteRead, status_code=201)
def add_favorite(data: schemas.FavoriteCreate, db: Session = Depends(get_db)):
    return crud.create(db, models.Favorite, payload(data))


@router.delete("/favorites/{item_id}", status_code=204)
def remove_favorite(item_id: int, db: Session = Depends(get_db)):
    crud.delete(db, crud.get_or_404(db, models.Favorite, item_id))


@router.get("/reviews", response_model=list[schemas.ReviewRead])
def reviews(db: Session = Depends(get_db)):
    return db.scalars(select(models.Review)).all()


@router.post("/reviews", response_model=schemas.ReviewRead, status_code=201)
def add_review(data: schemas.ReviewCreate, db: Session = Depends(get_db)):
    return crud.create(db, models.Review, payload(data))


@router.patch("/reviews/{item_id}", response_model=schemas.ReviewRead)
def edit_review(item_id: int, data: schemas.ReviewCreate, db: Session = Depends(get_db)):
    return crud.update(db, crud.get_or_404(db, models.Review, item_id), payload(data))


@router.delete("/reviews/{item_id}", status_code=204)
def remove_review(item_id: int, db: Session = Depends(get_db)):
    crud.delete(db, crud.get_or_404(db, models.Review, item_id))


@router.get("/preferences", response_model=list[schemas.PreferenceRead])
def preferences(db: Session = Depends(get_db)):
    return db.scalars(select(models.UserPreference)).all()


@router.post("/preferences", response_model=schemas.PreferenceRead, status_code=201)
def add_preference(data: schemas.PreferenceCreate, db: Session = Depends(get_db)):
    return crud.create(db, models.UserPreference, payload(data))


@router.patch("/preferences/{item_id}", response_model=schemas.PreferenceRead)
def edit_preference(item_id: int, data: schemas.PreferenceCreate, db: Session = Depends(get_db)):
    return crud.update(db, crud.get_or_404(db, models.UserPreference, item_id), payload(data))


@router.delete("/preferences/{item_id}", status_code=204)
def remove_preference(item_id: int, db: Session = Depends(get_db)):
    crud.delete(db, crud.get_or_404(db, models.UserPreference, item_id))
