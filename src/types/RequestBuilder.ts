import Request from "./Request";
import {GameMode} from "./Types";


export class RequestBuilder {
    private readonly _request: Request;

    constructor() {
        this._request = {
            name: "",
            avatar: undefined,
            mode: undefined,
            game_id: undefined,
            entry: undefined
        }
    }

    playerName(playerName: string): RequestBuilder {
        this._request.name = playerName;
        return this;
    }

    avatar(avatar: string): RequestBuilder {
        this._request.avatar = avatar;
        return this;
    }

    mode(mode: GameMode): RequestBuilder {
        this._request.mode = mode;
        return this;
    }

    game_id(game_id: string): RequestBuilder {
        this._request.game_id = game_id;
        return this;
    }

    entry(entry: string): RequestBuilder {
        this._request.entry = entry;
        return this;
    }

    build(): Request {
        return this._request;
    }
}