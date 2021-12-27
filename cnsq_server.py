import logging

import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from consequences_service import ConsequencesService
from objects.api import CreateRequest, JoinRequest, PollRequest, EntryRequest

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
        return consequences_service.create_game(request.name)
    except RuntimeError as e:
        logger.warning(e)


@app.post("/join")
async def join_game(request: JoinRequest):
    try:
        return consequences_service.join_game(request.game_id, request.name)
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


if __name__ == "__main__":
    uvicorn.run("cnsq_server:app", host="127.0.0.1", port=5000, log_level="info", workers=1)
