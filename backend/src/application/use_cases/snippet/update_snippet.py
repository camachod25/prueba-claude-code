import re
from uuid import UUID

from src.application.dtos.snippet_dto import UpdateSnippetDTO, SnippetResponseDTO
from src.application.ports.output.snippet_repository_port import ISnippetRepository
from src.domain.exceptions.domain_exceptions import SnippetNotFound, UnauthorizedAccess


def _extract_variables(body: str) -> list[str]:
    return list(dict.fromkeys(re.findall(r"\{\{(\w+)\}\}", body)))


class UpdateSnippetUseCase:
    def __init__(self, repository: ISnippetRepository):
        self._repository = repository

    async def execute(self, snippet_id: UUID, dto: UpdateSnippetDTO, requester_id: UUID) -> SnippetResponseDTO:
        snippet = await self._repository.find_by_id(snippet_id)
        if snippet is None:
            raise SnippetNotFound(str(snippet_id))
        if snippet.owner_id != requester_id:
            raise UnauthorizedAccess(str(snippet_id))

        if dto.body is not None:
            snippet.update_body(dto.body)
            snippet.variables = _extract_variables(dto.body)
        if dto.title is not None:
            snippet.title = dto.title
        if dto.description is not None:
            snippet.description = dto.description
        if dto.folder_id is not None:
            snippet.folder_id = dto.folder_id
        if dto.tags is not None:
            snippet.tags = dto.tags
        if dto.lang is not None:
            snippet.lang = dto.lang

        saved = await self._repository.save(snippet)
        return SnippetResponseDTO.model_validate(saved)
