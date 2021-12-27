import Request from "./types/Request";
import http from "./http-common";

const headers = {
    headers: {
        credentials: 'include',
    }
}

const createGame = (request: Request) => {
    return http.post("/create", request, headers);
};

const joinGame = (request: Request) => {
    return http.post("/join", request, headers)
}

const pollGame = (request: Request) => {
    return http.post("/poll", request, headers)
}

const startGame = (request: Request) => {
    return http.post("/start", request, headers)
}

const postEntry = (request: Request) => {
    return http.post("/post_entry", request, headers)
}

const ConsequencesService = {
    createGame,
    joinGame,
    pollGame,
    startGame,
    postEntry
}

export default ConsequencesService;