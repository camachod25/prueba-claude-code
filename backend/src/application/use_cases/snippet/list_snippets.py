from uuid import UUID

from src.application.dtos.snippet_dto import ListSnippetsFilterDTO, SnippetResponseDTO
from src.application.ports.output.snippet_repository_port import ISnippetRepository


class ListSnippetsUseCase:
    def __init__(self, repository: ISnippetRepository):
        self._repository = repository

    async def execute(self, filters: ListSnippetsFilterDTO, owner_id: UUID) -> list[SnippetResponseDTO]:
        snippets = await self._repository.find_by_owner(
            owner_id=owner_id,
            snippet_type=filters.type,
            folder_id=filters.folder_id,
            tags=filters.tags or None,
            search=filters.search,
            limit=filters.limit,
            offset=filters.offset,
        )
        if filters.favorites_only:
            snippets = [s for s in snippets if s.is_favorite]

        return [SnippetResponseDTO.model_validate(s) for s in snippets]
