from datetime import date, datetime, time
from typing import Annotated

from pydantic import BaseModel, ConfigDict, EmailStr, Field, HttpUrl, model_validator

Name = Annotated[str, Field(min_length=2, max_length=160)]
Latitude = Annotated[float, Field(ge=-90, le=90)]
Longitude = Annotated[float, Field(ge=-180, le=180)]


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class UserCreate(BaseModel):
    full_name: Name
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    phone: str | None = Field(default=None, max_length=30)


class UserRead(ORMModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str | None
    created_at: datetime
    updated_at: datetime
    is_active: bool
    is_admin: bool


class PlaceBase(BaseModel):
    description: str = Field(min_length=2, max_length=5000)
    city: Name
    latitude: Latitude
    longitude: Longitude
    image_url: HttpUrl | None = None
    is_active: bool = True


class DestinationCreate(PlaceBase):
    name_ar: Name
    name_en: str | None = Field(default=None, max_length=160)
    category: Name
    altitude: float | None = None
    opening_hours: str | None = Field(default=None, max_length=255)
    entry_fee: float | None = Field(default=None, ge=0)
    average_visit_duration: int | None = Field(default=None, ge=1)


class DestinationRead(DestinationCreate, ORMModel):
    id: int
    created_at: datetime
    updated_at: datetime


class AccommodationCreate(PlaceBase):
    name: Name
    accommodation_type: Name
    price_per_night: float | None = Field(default=None, ge=0)
    rating: float | None = Field(default=None, ge=0, le=5)
    contact_phone: str | None = Field(default=None, max_length=30)
    booking_url: HttpUrl | None = None


class AccommodationRead(AccommodationCreate, ORMModel):
    id: int
    created_at: datetime


class RestaurantCreate(PlaceBase):
    name: Name
    cuisine_type: Name
    average_price: float | None = Field(default=None, ge=0)
    rating: float | None = Field(default=None, ge=0, le=5)
    opening_hours: str | None = Field(default=None, max_length=255)


class RestaurantRead(RestaurantCreate, ORMModel):
    id: int
    created_at: datetime


class EventCreate(BaseModel):
    name: Name
    description: str = Field(min_length=2, max_length=5000)
    location_name: Name
    latitude: Latitude
    longitude: Longitude
    start_at: datetime
    end_at: datetime
    price: float | None = Field(default=None, ge=0)
    image_url: HttpUrl | None = None
    is_active: bool = True

    @model_validator(mode="after")
    def valid_period(self):
        if self.end_at <= self.start_at:
            raise ValueError("end_at must be after start_at")
        return self


class EventRead(EventCreate, ORMModel):
    id: int


class TripStopCreate(BaseModel):
    destination_id: int | None = None
    restaurant_id: int | None = None
    accommodation_id: int | None = None
    event_id: int | None = None
    visit_date: date
    start_time: time | None = None
    end_time: time | None = None
    position: int = Field(ge=0)
    notes: str | None = Field(default=None, max_length=2000)

    @model_validator(mode="after")
    def has_stop(self):
        if not any((self.destination_id, self.restaurant_id, self.accommodation_id, self.event_id)):
            raise ValueError("A trip stop must reference an item")
        return self


class TripStopRead(TripStopCreate, ORMModel):
    id: int
    trip_id: int


class TripCreate(BaseModel):
    user_id: int
    title: Name
    start_date: date
    end_date: date
    budget: float | None = Field(default=None, ge=0)
    people_count: int = Field(default=1, ge=1)
    status: str = Field(default="draft", max_length=30)

    @model_validator(mode="after")
    def valid_dates(self):
        if self.end_date < self.start_date:
            raise ValueError("end_date cannot be before start_date")
        return self


class TripRead(TripCreate, ORMModel):
    id: int
    created_at: datetime
    updated_at: datetime
    stops: list[TripStopRead] = []


class FavoriteCreate(BaseModel):
    user_id: int
    destination_id: int | None = None
    restaurant_id: int | None = None
    accommodation_id: int | None = None

    @model_validator(mode="after")
    def has_item(self):
        if not any((self.destination_id, self.restaurant_id, self.accommodation_id)):
            raise ValueError("A favorite must reference an item")
        return self


class FavoriteRead(FavoriteCreate, ORMModel):
    id: int
    created_at: datetime


class ReviewCreate(FavoriteCreate):
    rating: int = Field(ge=1, le=5)
    comment: str | None = Field(default=None, max_length=3000)


class ReviewRead(ReviewCreate, ORMModel):
    id: int
    created_at: datetime


class PreferenceCreate(BaseModel):
    user_id: int
    preferred_categories: str = Field(default="", max_length=2000)
    budget_level: str | None = Field(default=None, max_length=30)
    likes_nature: bool = False
    likes_heritage: bool = False
    likes_adventure: bool = False
    likes_food: bool = False
    traveling_with_children: bool = False
    traveling_with_elderly: bool = False
    mobility_limitations: str | None = Field(default=None, max_length=2000)


class PreferenceRead(PreferenceCreate, ORMModel):
    id: int
    updated_at: datetime


class Page(BaseModel):
    items: list
    total: int
    page: int
    page_size: int
