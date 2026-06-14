from typing import Literal

from pydantic import BaseModel


class OverviewMetric(BaseModel):
    key: str
    label: str
    value: str
    meta: str
    tone: Literal["green", "blue", "amber", "red", "neutral"]


class EquityPoint(BaseModel):
    date: str
    equity: float
    drawdown: float


class OverviewResponse(BaseModel):
    cash: float
    equity: float
    daily_pnl: float
    daily_pnl_percent: float
    running_strategies: int
    risk_status: Literal["normal", "warning", "blocked"]
    data_completeness: float
    metrics: list[OverviewMetric]
    equity_curve: list[EquityPoint]

