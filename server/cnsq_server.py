import logging

import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from consequences_service import ConsequencesService
from server.client_json import CreateRequest, JoinRequest, PollRequest, EntryRequest, ClearRequest, RestartRequest

app = FastAPI()
consequences_service = ConsequencesService()

ORIGINS = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FORMAT = '%(asctime)-15s %(message)s'
logging.basicConfig(format=FORMAT)
logger = logging.getLogger('cnsq_server')


@app.post("/create")
async def create_game(request: CreateRequest):
    try:
        return consequences_service.create_game(request.name, request.avatar, request.mode)
    except RuntimeError as e:
        logger.warning(e)


@app.post("/join")
async def join_game(request: JoinRequest):
    try:
        return consequences_service.join_game(request.game_id, request.name, request.avatar)
    except RuntimeError as e:
        logger.warning(e)


@app.post("/poll")
async def poll_game(request: PollRequest):
    try:
        return consequences_service.poll_game(request.name, request.game_id)
    except RuntimeError as e:
        logger.warning(e)


@app.post("/start")
async def start_game(request: PollRequest):
    try:
        return consequences_service.start_game(request.game_id)
    except RuntimeError as e:
        logger.warning(e)


@app.post("/post_entry")
async def post_entry(request: EntryRequest):
    try:
        return consequences_service.post_entry(request)
    except RuntimeError as e:
        logger.warning(e)


@app.post("/restart")
async def restart(request: RestartRequest):
    try:
        return consequences_service.restart_game(request.game_id)
    except RuntimeError as e:
        logger.warning(e)


@app.post("/clear")
async def clear_games(request: ClearRequest):
    try:
        return consequences_service.clear_games(request.confirm)
    except RuntimeError as e:
        logger.warning(e)


if __name__ == "__main__":
    uvicorn.run("cnsq_server:app", host="127.0.0.1", port=5000, log_level="info", workers=1)
