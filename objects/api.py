from pydantic import BaseModel


class CreateRequest(BaseModel):
    name: str
    avatar: str


class JoinRequest(BaseModel):
    name: str
    game_id: str
    avatar: str


class PollRequest(BaseModel):
    name: str
    game_id: str


class EntryRequest(BaseModel):
    name: str
    game_id: str
    entry: str


class ClearRequest(BaseModel):
    confirm: bool
