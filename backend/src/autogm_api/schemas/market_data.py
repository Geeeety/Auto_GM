from pydantic import BaseModel


class Bar(BaseModel):
    time: str
    open: float
    high: float
    low: float
    close: float
    volume: float


class DataQualityItem(BaseModel):
    label: str
    value: str
    tone: str


class BarSeriesResponse(BaseModel):
    symbol: str
    timeframe: str
    source: str
    bars: list[Bar]
    quality: list[DataQualityItem]

