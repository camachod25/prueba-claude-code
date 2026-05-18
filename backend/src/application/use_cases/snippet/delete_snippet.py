from uuid import UUID

from src.application.ports.output.snippet_repository_port import ISnippetRepository
from src.domain.exceptions.domain_exceptions import SnippetNotFound, UnauthorizedAccess


class DeleteSnippetUseCase:
    def __init__(self, repository: ISnippetRepository):
        self._repository = repository

    async def execute(self, snippet_id: UUID, requester_id: UUID) -> None:
        snippet = await self._repository.find_by_id(snippet_id)
        if snippet is None:
            raise SnippetNotFound(str(snippet_id))
        if snippet.owner_id != requester_id:
            raise UnauthorizedAccess(str(snippet_id))

        await self._repository.delete(snippet_id)
