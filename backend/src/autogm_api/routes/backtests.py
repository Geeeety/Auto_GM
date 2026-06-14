from fastapi import APIRouter

from autogm_api.schemas.backtests import BacktestSummaryResponse
from autogm_api.services.mock_data import get_mock_backtest

router = APIRouter(prefix="/backtests", tags=["backtests"])


@router.get("/mock", response_model=BacktestSummaryResponse)
def read_mock_backtest() -> BacktestSummaryResponse:
    return get_mock_backtest()

