from typing import Literal

from pydantic import BaseModel


class StrategyStatus(BaseModel):
    name: str
    market: str
    status: Literal["running", "idle", "backtesting"]
    status_label: str
    signal: str
    pnl: str
    risk: Literal["normal", "watch", "blocked"]


class StrategyParameter(BaseModel):
    key: str
    value: str
    tone: Literal["green", "blue", "amber", "red", "neutral"]


class StrategyListResponse(BaseModel):
    strategies: list[StrategyStatus]
    active_strategy: str
    parameters: list[StrategyParameter]

