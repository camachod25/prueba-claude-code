from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from src.domain.value_objects.snippet_type import SnippetType


class CreateSnippetDTO(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    body: str = Field(min_length=1)
    type: SnippetType
    description: str = ""
    folder_id: UUID | None = None
    tags: list[str] = []
    lang: str = "text"


class UpdateSnippetDTO(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    body: str | None = None
    description: str | None = None
    folder_id: UUID | None = None
    tags: list[str] | None = None
    lang: str | None = None


class ListSnippetsFilterDTO(BaseModel):
    type: SnippetType | None = None
    folder_id: UUID | None = None
    tags: list[str] = []
    search: str | None = None
    favorites_only: bool = False
    limit: int = Field(default=50, ge=1, le=100)
    offset: int = Field(default=0, ge=0)


class SnippetResponseDTO(BaseModel):
    id: UUID
    title: str
    body: str
    type: SnippetType
    description: str
    folder_id: UUID | None
    tags: list[str]
    variables: list[str]
    lang: str
    is_favorite: bool
    shared_with: list[UUID]
    version: int
    use_count: int
    owner_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
