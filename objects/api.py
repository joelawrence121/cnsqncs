from pydantic import BaseModel


class CreateRequest(BaseModel):
    name: str


class JoinRequest(BaseModel):
    name: str
    game_id: str


class PollRequest(BaseModel):
    name: str
    game_id: str


class EntryRequest(BaseModel):
    name: str
    game_id: str
    entry: str
