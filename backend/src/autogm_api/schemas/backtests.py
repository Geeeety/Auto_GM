from typing import Literal

from pydantic import BaseModel


class BacktestMetric(BaseModel):
    name: str
    value: float
    display_value: str
    tone: Literal["green", "blue", "amber", "red", "neutral"]


class BacktestSummaryResponse(BaseModel):
    strategy: str
    symbol: str
    timeframe: str
    initial_cash: float
    metrics: list[BacktestMetric]

