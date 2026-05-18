from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "PENTA API"
    debug: bool = False
    database_url: str = "sqlite+aiosqlite:///./penta.db"
    secret_key: str = "change-me-in-production"
    cors_origins: list[str] = ["http://localhost:8080"]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
