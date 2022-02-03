from pydantic import BaseModel


class CreateRequest(BaseModel):
    name: str
    avatar: str
    mode: str


class JoinRequest(BaseModel):
    name: str
    game_id: str
    avatar: str


class StartRequest(BaseModel):
    name: str
    game_id: str


class PollRequest(BaseModel):
    name: str
    game_id: str
    session_id: str
    game_state: int


class EntryRequest(BaseModel):
    name: str
    game_id: str
    entry: str


class RestartRequest(BaseModel):
    game_id: str


class ClearRequest(BaseModel):
    confirm: bool
