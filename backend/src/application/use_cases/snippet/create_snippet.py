import re
from uuid import UUID

from src.application.dtos.snippet_dto import CreateSnippetDTO, SnippetResponseDTO
from src.application.ports.output.snippet_repository_port import ISnippetRepository
from src.domain.entities.snippet import Snippet


def _extract_variables(body: str) -> list[str]:
    return list(dict.fromkeys(re.findall(r"\{\{(\w+)\}\}", body)))


class CreateSnippetUseCase:
    def __init__(self, repository: ISnippetRepository):
        self._repository = repository

    async def execute(self, dto: CreateSnippetDTO, owner_id: UUID) -> SnippetResponseDTO:
        snippet = Snippet(
            title=dto.title,
            body=dto.body,
            type=dto.type,
            owner_id=owner_id,
            description=dto.description,
            folder_id=dto.folder_id,
            tags=dto.tags,
            lang=dto.lang,
            variables=_extract_variables(dto.body),
        )
        saved = await self._repository.save(snippet)
        return SnippetResponseDTO.model_validate(saved)
