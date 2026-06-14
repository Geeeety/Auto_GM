from fastapi import APIRouter

from autogm_api.schemas.market_data import BarSeriesResponse
from autogm_api.services.mock_data import get_mock_bars

router = APIRouter(prefix="/market", tags=["market-data"])


@router.get("/bars/mock", response_model=BarSeriesResponse)
def read_mock_bars() -> BarSeriesResponse:
    return get_mock_bars()

