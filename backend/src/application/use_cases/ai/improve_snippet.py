from abc import ABC, abstractmethod
from uuid import UUID

from src.application.dtos.snippet_dto import SnippetResponseDTO
from src.application.ports.output.snippet_repository_port import ISnippetRepository
from src.domain.exceptions.domain_exceptions import SnippetNotFound, UnauthorizedAccess


class IAIProvider(ABC):
    @abstractmethod
    async def improve(self, body: str, instruction: str) -> str:
        ...


class ImproveSnippetUseCase:
    def __init__(self, repository: ISnippetRepository, ai_provider: IAIProvider):
        self._repository = repository
        self._ai_provider = ai_provider

    async def execute(self, snippet_id: UUID, instruction: str, requester_id: UUID) -> SnippetResponseDTO:
        snippet = await self._repository.find_by_id(snippet_id)
        if snippet is None:
            raise SnippetNotFound(str(snippet_id))

        is_owner = snippet.owner_id == requester_id
        is_shared = requester_id in snippet.shared_with
        if not is_owner and not is_shared:
            raise UnauthorizedAccess(str(snippet_id))

        improved_body = await self._ai_provider.improve(snippet.body, instruction)
        snippet.update_body(improved_body)
        saved = await self._repository.save(snippet)
        return SnippetResponseDTO.model_validate(saved)
