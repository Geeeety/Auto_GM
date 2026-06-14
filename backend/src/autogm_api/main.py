from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from autogm_api.routes import backtests, health, market_data, overview, risk, strategies, system_logs
from autogm_api.settings import get_settings


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="Local API service for the Auto_GM quant trading dashboard.",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.allowed_origins),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(overview.router, prefix=settings.api_prefix)
    app.include_router(market_data.router, prefix=settings.api_prefix)
    app.include_router(strategies.router, prefix=settings.api_prefix)
    app.include_router(backtests.router, prefix=settings.api_prefix)
    app.include_router(risk.router, prefix=settings.api_prefix)
    app.include_router(system_logs.router, prefix=settings.api_prefix)

    return app


app = create_app()

