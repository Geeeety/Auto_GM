from typing import Literal

from pydantic import BaseModel


class RiskRule(BaseModel):
    title: str
    value: str
    status: Literal["enabled", "standby", "disabled"]
    status_label: str


class RiskEvent(BaseModel):
    time: str
    rule: str
    result: str
    level: Literal["ok", "danger", "warning"]


class RiskCenterResponse(BaseModel):
    status: Literal["normal", "warning", "blocked"]
    rules: list[RiskRule]
    events: list[RiskEvent]

