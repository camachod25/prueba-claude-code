import json
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.application.ports.output.snippet_repository_port import ISnippetRepository
from src.domain.entities.snippet import Snippet
from src.domain.value_objects.snippet_type import SnippetType
from src.infrastructure.persistence.models.snippet_model import SnippetModel


def _to_entity(model: SnippetModel) -> Snippet:
    return Snippet(
        id=model.id,
        title=model.title,
        body=model.body,
        type=SnippetType(model.type),
        owner_id=model.owner_id,
        description=model.description,
        folder_id=model.folder_id,
        tags=json.loads(model.tags or "[]"),
        variables=json.loads(model.variables or "[]"),
        lang=model.lang,
        is_favorite=model.is_favorite,
        shared_with=[UUID(u) for u in json.loads(model.shared_with or "[]")],
        version=model.version,
        use_count=model.use_count,
        created_at=model.created_at,
        updated_at=model.updated_at,
    )


def _to_model(entity: Snippet) -> SnippetModel:
    return SnippetModel(
        id=entity.id,
        title=entity.title,
        body=entity.body,
        type=entity.type.value,
        owner_id=entity.owner_id,
        description=entity.description,
        folder_id=entity.folder_id,
        tags=json.dumps(entity.tags),
        variables=json.dumps(entity.variables),
        lang=entity.lang,
        is_favorite=entity.is_favorite,
        shared_with=json.dumps([str(u) for u in entity.shared_with]),
        version=entity.version,
        use_count=entity.use_count,
        created_at=entity.created_at,
        updated_at=entity.updated_at,
    )


class SQLAlchemySnippetRepository(ISnippetRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def save(self, snippet: Snippet) -> Snippet:
        existing = await self._session.get(SnippetModel, snippet.id)
        if existing:
            for key, value in _to_model(snippet).__dict__.items():
                if not key.startswith("_"):
                    setattr(existing, key, value)
        else:
            self._session.add(_to_model(snippet))
        await self._session.flush()
        return snippet

    async def find_by_id(self, snippet_id: UUID) -> Snippet | None:
        model = await self._session.get(SnippetModel, snippet_id)
        return _to_entity(model) if model else None

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
        stmt = select(SnippetModel).where(SnippetModel.owner_id == owner_id)

        if snippet_type:
            stmt = stmt.where(SnippetModel.type == snippet_type.value)
        if folder_id:
            stmt = stmt.where(SnippetModel.folder_id == folder_id)
        if search:
            stmt = stmt.where(
                SnippetModel.title.ilike(f"%{search}%")
                | SnippetModel.body.ilike(f"%{search}%")
            )

        stmt = stmt.offset(offset).limit(limit)
        result = await self._session.execute(stmt)
        models = result.scalars().all()

        entities = [_to_entity(m) for m in models]

        if tags:
            entities = [e for e in entities if any(t in e.tags for t in tags)]

        return entities

    async def delete(self, snippet_id: UUID) -> None:
        model = await self._session.get(SnippetModel, snippet_id)
        if model:
            await self._session.delete(model)

    async def count_by_owner(self, owner_id: UUID) -> int:
        result = await self._session.execute(
            select(SnippetModel).where(SnippetModel.owner_id == owner_id)
        )
        return len(result.scalars().all())
