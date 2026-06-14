from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Auto_GM API"
    app_version: str = "0.1.0"
    api_prefix: str = "/api"
    environment: str = "local"
    allowed_origins: tuple[str, ...] = (
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    )

    model_config = SettingsConfigDict(env_prefix="AUTOGM_", env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()

