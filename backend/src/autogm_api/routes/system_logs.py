from fastapi import APIRouter

from autogm_api.schemas.logs import SystemLogResponse
from autogm_api.services.mock_data import get_mock_logs

router = APIRouter(prefix="/logs", tags=["system-logs"])


@router.get("/mock", response_model=SystemLogResponse)
def read_mock_logs() -> SystemLogResponse:
    return get_mock_logs()

