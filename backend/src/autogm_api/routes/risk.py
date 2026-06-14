from fastapi import APIRouter

from autogm_api.schemas.risk import RiskCenterResponse
from autogm_api.services.mock_data import get_mock_risk

router = APIRouter(prefix="/risk", tags=["risk"])


@router.get("/mock", response_model=RiskCenterResponse)
def read_mock_risk() -> RiskCenterResponse:
    return get_mock_risk()

