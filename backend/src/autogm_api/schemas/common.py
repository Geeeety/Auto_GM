from typing import Literal

from pydantic import BaseModel, Field


class AppInfoResponse(BaseModel):
    app: str
    version: str
    environment: str
    message: str


class HealthResponse(BaseModel):
    app: str
    version: str
    status: Literal["ok"]
    environment: str


class MoneyValue(BaseModel):
    amount: float
    currency: str = "USD"


class PercentValue(BaseModel):
    value: float = Field(description="Percent value. Example: 2.35 means 2.35%.")

