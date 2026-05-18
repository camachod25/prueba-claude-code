from dataclasses import dataclass, field
from datetime import datetime
from uuid import UUID, uuid4


@dataclass
class Folder:
    name: str
    owner_id: UUID
    id: UUID = field(default_factory=uuid4)
    color: str = "#2DD4BF"
    created_at: datetime = field(default_factory=datetime.utcnow)
