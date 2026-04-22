from typing import TypedDict
from pydantic import BaseModel


# ---------------------------------------------------------------
# Pydantic / Type
# ---------------------------------------------------------------
class RootResponse(BaseModel):
    status: str = "The server is up and running."


class HistoryEntry(TypedDict):
    role: str
    message: str


class AiRequest(BaseModel):
    user_prompt: str
    history: list[HistoryEntry]
    is_serious: bool = True
    is_new_conversation: bool = True


class AiResponse(BaseModel):
    system_response: str = ""
