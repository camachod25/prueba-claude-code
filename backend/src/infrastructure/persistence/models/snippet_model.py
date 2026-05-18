from datetime import datetime
from uuid import UUID

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class SnippetModel(Base):
    __tablename__ = "snippets"

    id: Mapped[UUID] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    folder_id: Mapped[UUID | None] = mapped_column(ForeignKey("folders.id"), nullable=True)
    tags: Mapped[str] = mapped_column(Text, default="")           # JSON array stored as string
    variables: Mapped[str] = mapped_column(Text, default="")      # JSON array stored as string
    lang: Mapped[str] = mapped_column(String(30), default="text")
    is_favorite: Mapped[bool] = mapped_column(Boolean, default=False)
    shared_with: Mapped[str] = mapped_column(Text, default="")    # JSON array stored as string
    version: Mapped[int] = mapped_column(Integer, default=1)
    use_count: Mapped[int] = mapped_column(Integer, default=0)
    owner_id: Mapped[UUID] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
