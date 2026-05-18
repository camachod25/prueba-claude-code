from abc import ABC, abstractmethod
from uuid import UUID

from src.domain.entities.snippet import Snippet
from src.domain.value_objects.snippet_type import SnippetType


class ISnippetRepository(ABC):

    @abstractmethod
    async def save(self, snippet: Snippet) -> Snippet:
        ...

    @abstractmethod
    async def find_by_id(self, snippet_id: UUID) -> Snippet | None:
        ...

    @abstractmethod
    async def find_by_owner(
        self,
        owner_id: UUID,
        snippet_type: SnippetType | None = None,
        folder_id: UUID | None = None,
        tags: list[str] | None = None,
        search: str | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[Snippet]:
        ...

    @abstractmethod
    async def delete(self, snippet_id: UUID) -> None:
        ...

    @abstractmethod
    async def count_by_owner(self, owner_id: UUID) -> int:
        ...
