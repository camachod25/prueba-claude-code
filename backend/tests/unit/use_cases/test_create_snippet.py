from unittest.mock import AsyncMock
from uuid import uuid4

import pytest

from src.application.dtos.snippet_dto import CreateSnippetDTO
from src.application.use_cases.snippet.create_snippet import CreateSnippetUseCase
from src.domain.entities.snippet import Snippet
from src.domain.value_objects.snippet_type import SnippetType


@pytest.fixture
def mock_repository():
    repo = AsyncMock()
    repo.save.side_effect = lambda s: s
    return repo


@pytest.mark.asyncio
async def test_create_snippet_extracts_variables(mock_repository):
    use_case = CreateSnippetUseCase(mock_repository)
    dto = CreateSnippetDTO(
        title="Code review",
        body="Review {{lang}} code with context {{context}}",
        type=SnippetType.PROMPT,
    )

    result = await use_case.execute(dto, owner_id=uuid4())

    assert set(result.variables) == {"lang", "context"}
    mock_repository.save.assert_called_once()


@pytest.mark.asyncio
async def test_create_snippet_no_variables(mock_repository):
    use_case = CreateSnippetUseCase(mock_repository)
    dto = CreateSnippetDTO(
        title="Hello world",
        body="print('hello')",
        type=SnippetType.CODE,
        lang="py",
    )

    result = await use_case.execute(dto, owner_id=uuid4())

    assert result.variables == []
    assert result.lang == "py"
