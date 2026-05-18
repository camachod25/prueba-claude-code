from typing import AsyncGenerator
from uuid import UUID

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from src.application.use_cases.snippet.create_snippet import CreateSnippetUseCase
from src.application.use_cases.snippet.delete_snippet import DeleteSnippetUseCase
from src.application.use_cases.snippet.get_snippet import GetSnippetUseCase
from src.application.use_cases.snippet.list_snippets import ListSnippetsUseCase
from src.application.use_cases.snippet.toggle_favorite import ToggleFavoriteUseCase
from src.application.use_cases.snippet.update_snippet import UpdateSnippetUseCase
from src.infrastructure.config.settings import settings
from src.infrastructure.persistence.repositories.snippet_repository import SQLAlchemySnippetRepository

engine = create_async_engine(settings.database_url, echo=settings.debug)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        async with session.begin():
            yield session


def get_snippet_repository(session: AsyncSession = Depends(get_db)):
    return SQLAlchemySnippetRepository(session)


def get_create_snippet_uc(repo=Depends(get_snippet_repository)):
    return CreateSnippetUseCase(repo)


def get_get_snippet_uc(repo=Depends(get_snippet_repository)):
    return GetSnippetUseCase(repo)


def get_list_snippets_uc(repo=Depends(get_snippet_repository)):
    return ListSnippetsUseCase(repo)


def get_update_snippet_uc(repo=Depends(get_snippet_repository)):
    return UpdateSnippetUseCase(repo)


def get_delete_snippet_uc(repo=Depends(get_snippet_repository)):
    return DeleteSnippetUseCase(repo)


def get_toggle_favorite_uc(repo=Depends(get_snippet_repository)):
    return ToggleFavoriteUseCase(repo)


# Stub: replace with real JWT validation
async def get_current_user_id() -> UUID:
    return UUID("00000000-0000-0000-0000-000000000001")
