from abc import ABC, abstractmethod
from uuid import UUID

from src.application.dtos.snippet_dto import (
    CreateSnippetDTO,
    SnippetResponseDTO,
    UpdateSnippetDTO,
    ListSnippetsFilterDTO,
)


class ISnippetService(ABC):

    @abstractmethod
    async def create(self, dto: CreateSnippetDTO, owner_id: UUID) -> SnippetResponseDTO:
        ...

    @abstractmethod
    async def get_by_id(self, snippet_id: UUID, requester_id: UUID) -> SnippetResponseDTO:
        ...

    @abstractmethod
    async def list(self, filters: ListSnippetsFilterDTO, owner_id: UUID) -> list[SnippetResponseDTO]:
        ...

    @abstractmethod
    async def update(self, snippet_id: UUID, dto: UpdateSnippetDTO, requester_id: UUID) -> SnippetResponseDTO:
        ...

    @abstractmethod
    async def delete(self, snippet_id: UUID, requester_id: UUID) -> None:
        ...

    @abstractmethod
    async def toggle_favorite(self, snippet_id: UUID, requester_id: UUID) -> SnippetResponseDTO:
        ...
