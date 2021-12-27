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

const ConsequencesService = {
    createGame,
    joinGame,
    pollGame
}

export default ConsequencesService;