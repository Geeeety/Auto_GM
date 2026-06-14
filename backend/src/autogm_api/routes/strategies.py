from fastapi import APIRouter

from autogm_api.schemas.strategies import StrategyListResponse
from autogm_api.services.mock_data import get_mock_strategies

router = APIRouter(prefix="/strategies", tags=["strategies"])


@router.get("/mock", response_model=StrategyListResponse)
def read_mock_strategies() -> StrategyListResponse:
    return get_mock_strategies()

