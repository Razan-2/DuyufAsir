from datetime import date, datetime, time, timezone

from sqlalchemy import Boolean, CheckConstraint, Date, DateTime, Float, ForeignKey, Integer, String, Text, Time, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)


class User(Base, TimestampMixin):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    hashed_password: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    trips: Mapped[list["Trip"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class PlaceMixin(TimestampMixin):
    id: Mapped[int] = mapped_column(primary_key=True)
    description: Mapped[str] = mapped_column(Text)
    city: Mapped[str] = mapped_column(String(100), index=True)
    latitude: Mapped[float] = mapped_column(Float, index=True)
    longitude: Mapped[float] = mapped_column(Float, index=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class Destination(Base, PlaceMixin):
    __tablename__ = "destinations"
    name_ar: Mapped[str] = mapped_column(String(160))
    name_en: Mapped[str | None] = mapped_column(String(160), nullable=True)
    category: Mapped[str] = mapped_column(String(80))
    altitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    opening_hours: Mapped[str | None] = mapped_column(String(255), nullable=True)
    entry_fee: Mapped[float | None] = mapped_column(Float, nullable=True)
    average_visit_duration: Mapped[int | None] = mapped_column(Integer, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)


class Accommodation(Base, PlaceMixin):
    __tablename__ = "accommodations"
    name: Mapped[str] = mapped_column(String(160))
    accommodation_type: Mapped[str] = mapped_column(String(80))
    price_per_night: Mapped[float | None] = mapped_column(Float, nullable=True)
    rating: Mapped[float | None] = mapped_column(Float, nullable=True)
    contact_phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    booking_url: Mapped[str | None] = mapped_column(String(500), nullable=True)


class Restaurant(Base, PlaceMixin):
    __tablename__ = "restaurants"
    name: Mapped[str] = mapped_column(String(160))
    cuisine_type: Mapped[str] = mapped_column(String(80))
    average_price: Mapped[float | None] = mapped_column(Float, nullable=True)
    rating: Mapped[float | None] = mapped_column(Float, nullable=True)
    opening_hours: Mapped[str | None] = mapped_column(String(255), nullable=True)


class Event(Base):
    __tablename__ = "events"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(160))
    description: Mapped[str] = mapped_column(Text)
    location_name: Mapped[str] = mapped_column(String(160))
    latitude: Mapped[float] = mapped_column(Float, index=True)
    longitude: Mapped[float] = mapped_column(Float, index=True)
    start_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    end_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    price: Mapped[float | None] = mapped_column(Float, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class Trip(Base, TimestampMixin):
    __tablename__ = "trips"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(160))
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    budget: Mapped[float | None] = mapped_column(Float, nullable=True)
    people_count: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[str] = mapped_column(String(30), default="draft")
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
    user: Mapped[User] = relationship(back_populates="trips")
    stops: Mapped[list["TripStop"]] = relationship(back_populates="trip", cascade="all, delete-orphan", order_by="TripStop.position", lazy="selectin")


class TripStop(Base):
    __tablename__ = "trip_stops"
    id: Mapped[int] = mapped_column(primary_key=True)
    trip_id: Mapped[int] = mapped_column(ForeignKey("trips.id", ondelete="CASCADE"), index=True)
    destination_id: Mapped[int | None] = mapped_column(ForeignKey("destinations.id"), index=True, nullable=True)
    restaurant_id: Mapped[int | None] = mapped_column(ForeignKey("restaurants.id"), nullable=True)
    accommodation_id: Mapped[int | None] = mapped_column(ForeignKey("accommodations.id"), nullable=True)
    event_id: Mapped[int | None] = mapped_column(ForeignKey("events.id"), nullable=True)
    visit_date: Mapped[date] = mapped_column(Date)
    start_time: Mapped[time | None] = mapped_column(Time, nullable=True)
    end_time: Mapped[time | None] = mapped_column(Time, nullable=True)
    position: Mapped[int] = mapped_column(Integer)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    trip: Mapped[Trip] = relationship(back_populates="stops")


class Favorite(Base, TimestampMixin):
    __tablename__ = "favorites"
    __table_args__ = (CheckConstraint("destination_id IS NOT NULL OR restaurant_id IS NOT NULL OR accommodation_id IS NOT NULL", name="favorite_has_item"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    destination_id: Mapped[int | None] = mapped_column(ForeignKey("destinations.id"), index=True, nullable=True)
    restaurant_id: Mapped[int | None] = mapped_column(ForeignKey("restaurants.id"), nullable=True)
    accommodation_id: Mapped[int | None] = mapped_column(ForeignKey("accommodations.id"), nullable=True)


class Review(Base, TimestampMixin):
    __tablename__ = "reviews"
    __table_args__ = (CheckConstraint("rating BETWEEN 1 AND 5", name="review_rating_range"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    destination_id: Mapped[int | None] = mapped_column(ForeignKey("destinations.id"), index=True, nullable=True)
    restaurant_id: Mapped[int | None] = mapped_column(ForeignKey("restaurants.id"), nullable=True)
    accommodation_id: Mapped[int | None] = mapped_column(ForeignKey("accommodations.id"), nullable=True)
    rating: Mapped[int] = mapped_column(Integer)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)


class UserPreference(Base):
    __tablename__ = "user_preferences"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True)
    preferred_categories: Mapped[str] = mapped_column(Text, default="")
    budget_level: Mapped[str | None] = mapped_column(String(30), nullable=True)
    likes_nature: Mapped[bool] = mapped_column(Boolean, default=False)
    likes_heritage: Mapped[bool] = mapped_column(Boolean, default=False)
    likes_adventure: Mapped[bool] = mapped_column(Boolean, default=False)
    likes_food: Mapped[bool] = mapped_column(Boolean, default=False)
    traveling_with_children: Mapped[bool] = mapped_column(Boolean, default=False)
    traveling_with_elderly: Mapped[bool] = mapped_column(Boolean, default=False)
    mobility_limitations: Mapped[str | None] = mapped_column(Text, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)


class EnvironmentalReading(Base):
    __tablename__ = "environmental_readings"
    id: Mapped[int] = mapped_column(primary_key=True)
    latitude: Mapped[float] = mapped_column(Float, index=True)
    longitude: Mapped[float] = mapped_column(Float, index=True)
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    visibility_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    fog_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    temperature: Mapped[float | None] = mapped_column(Float, nullable=True)
    weather_condition: Mapped[str | None] = mapped_column(String(100), nullable=True)
    altitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    confidence_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    source_type: Mapped[str] = mapped_column(String(50))
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), index=True, nullable=True)


class ExperienceScore(Base):
    __tablename__ = "experience_scores"
    __table_args__ = (CheckConstraint("score BETWEEN 0 AND 100", name="experience_score_range"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    destination_id: Mapped[int] = mapped_column(ForeignKey("destinations.id"), index=True)
    calculated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    score: Mapped[float] = mapped_column(Float)
    visibility_component: Mapped[float | None] = mapped_column(Float, nullable=True)
    weather_component: Mapped[float | None] = mapped_column(Float, nullable=True)
    time_component: Mapped[float | None] = mapped_column(Float, nullable=True)
    accessibility_component: Mapped[float | None] = mapped_column(Float, nullable=True)
    confidence_score: Mapped[float | None] = mapped_column(Float, nullable=True)


class OptimalWindow(Base, TimestampMixin):
    __tablename__ = "optimal_windows"
    id: Mapped[int] = mapped_column(primary_key=True)
    destination_id: Mapped[int] = mapped_column(ForeignKey("destinations.id"), index=True)
    start_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    end_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    predicted_score: Mapped[float] = mapped_column(Float)
