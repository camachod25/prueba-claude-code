from uuid import UUID

from pydantic import BaseModel, EmailStr


class CreateUserDTO(BaseModel):
    email: EmailStr
    name: str
    initials: str
    color: str = "#2DD4BF"


class UserResponseDTO(BaseModel):
    id: UUID
    email: str
    name: str
    initials: str
    color: str

    model_config = {"from_attributes": True}
