from fastapi import APIRouter

from autogm_api.schemas.overview import OverviewResponse
from autogm_api.services.mock_data import get_overview

router = APIRouter(prefix="/overview", tags=["overview"])


@router.get("", response_model=OverviewResponse)
def read_overview() -> OverviewResponse:
    return get_overview()

