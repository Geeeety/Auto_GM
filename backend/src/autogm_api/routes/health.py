from fastapi import APIRouter

from autogm_api.schemas.common import AppInfoResponse, HealthResponse
from autogm_api.settings import get_settings

router = APIRouter(tags=["health"])


@router.get("/", response_model=AppInfoResponse)
def read_root() -> AppInfoResponse:
    settings = get_settings()
    return AppInfoResponse(
        app=settings.app_name,
        version=settings.app_version,
        environment=settings.environment,
        message="Auto_GM backend is ready for local development.",
    )


@router.get("/health", response_model=HealthResponse)
def read_health() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(
        app=settings.app_name,
        version=settings.app_version,
        status="ok",
        environment=settings.environment,
    )

