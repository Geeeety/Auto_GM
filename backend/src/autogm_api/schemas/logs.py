from typing import Literal

from pydantic import BaseModel


class SystemLog(BaseModel):
    time: str
    module: str
    level: Literal["debug", "info", "warn", "error"]
    message: str


class SystemLogResponse(BaseModel):
    logs: list[SystemLog]

