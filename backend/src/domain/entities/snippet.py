from dataclasses import dataclass, field
from datetime import datetime
from uuid import UUID, uuid4

from src.domain.value_objects.snippet_type import SnippetType


@dataclass
class Snippet:
    title: str
    body: str
    type: SnippetType
    owner_id: UUID
    id: UUID = field(default_factory=uuid4)
    description: str = ""
    folder_id: UUID | None = None
    tags: list[str] = field(default_factory=list)
    variables: list[str] = field(default_factory=list)
    lang: str = "text"
    is_favorite: bool = False
    shared_with: list[UUID] = field(default_factory=list)
    version: int = 1
    use_count: int = 0
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)

    def increment_use_count(self) -> None:
        self.use_count += 1
        self.updated_at = datetime.utcnow()

    def toggle_favorite(self) -> None:
        self.is_favorite = not self.is_favorite
        self.updated_at = datetime.utcnow()

    def update_body(self, new_body: str) -> None:
        self.body = new_body
        self.version += 1
        self.updated_at = datetime.utcnow()

    def share_with(self, user_id: UUID) -> None:
        if user_id not in self.shared_with:
            self.shared_with.append(user_id)
            self.updated_at = datetime.utcnow()
