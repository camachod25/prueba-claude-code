from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status

from src.application.dtos.snippet_dto import (
    CreateSnippetDTO,
    ListSnippetsFilterDTO,
    SnippetResponseDTO,
    UpdateSnippetDTO,
)
from src.application.use_cases.snippet.create_snippet import CreateSnippetUseCase
from src.application.use_cases.snippet.delete_snippet import DeleteSnippetUseCase
from src.application.use_cases.snippet.get_snippet import GetSnippetUseCase
from src.application.use_cases.snippet.list_snippets import ListSnippetsUseCase
from src.application.use_cases.snippet.toggle_favorite import ToggleFavoriteUseCase
from src.application.use_cases.snippet.update_snippet import UpdateSnippetUseCase
from src.domain.exceptions.domain_exceptions import SnippetNotFound, UnauthorizedAccess
from src.domain.value_objects.snippet_type import SnippetType
from src.infrastructure.api.dependencies import (
    get_create_snippet_uc,
    get_current_user_id,
    get_delete_snippet_uc,
    get_get_snippet_uc,
    get_list_snippets_uc,
    get_toggle_favorite_uc,
    get_update_snippet_uc,
)

router = APIRouter(prefix="/snippets", tags=["snippets"])


@router.post("/", response_model=SnippetResponseDTO, status_code=status.HTTP_201_CREATED)
async def create_snippet(
    body: CreateSnippetDTO,
    use_case: CreateSnippetUseCase = Depends(get_create_snippet_uc),
    user_id: UUID = Depends(get_current_user_id),
):
    return await use_case.execute(body, user_id)


@router.get("/", response_model=list[SnippetResponseDTO])
async def list_snippets(
    type: SnippetType | None = Query(default=None),
    folder_id: UUID | None = Query(default=None),
    search: str | None = Query(default=None),
    favorites_only: bool = Query(default=False),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    use_case: ListSnippetsUseCase = Depends(get_list_snippets_uc),
    user_id: UUID = Depends(get_current_user_id),
):
    filters = ListSnippetsFilterDTO(
        type=type,
        folder_id=folder_id,
        search=search,
        favorites_only=favorites_only,
        limit=limit,
        offset=offset,
    )
    return await use_case.execute(filters, user_id)


@router.get("/{snippet_id}", response_model=SnippetResponseDTO)
async def get_snippet(
    snippet_id: UUID,
    use_case: GetSnippetUseCase = Depends(get_get_snippet_uc),
    user_id: UUID = Depends(get_current_user_id),
):
    try:
        return await use_case.execute(snippet_id, user_id)
    except SnippetNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedAccess as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.patch("/{snippet_id}", response_model=SnippetResponseDTO)
async def update_snippet(
    snippet_id: UUID,
    body: UpdateSnippetDTO,
    use_case: UpdateSnippetUseCase = Depends(get_update_snippet_uc),
    user_id: UUID = Depends(get_current_user_id),
):
    try:
        return await use_case.execute(snippet_id, body, user_id)
    except SnippetNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedAccess as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.delete("/{snippet_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_snippet(
    snippet_id: UUID,
    use_case: DeleteSnippetUseCase = Depends(get_delete_snippet_uc),
    user_id: UUID = Depends(get_current_user_id),
):
    try:
        await use_case.execute(snippet_id, user_id)
    except SnippetNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedAccess as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.post("/{snippet_id}/favorite", response_model=SnippetResponseDTO)
async def toggle_favorite(
    snippet_id: UUID,
    use_case: ToggleFavoriteUseCase = Depends(get_toggle_favorite_uc),
    user_id: UUID = Depends(get_current_user_id),
):
    try:
        return await use_case.execute(snippet_id, user_id)
    except SnippetNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except UnauthorizedAccess as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
