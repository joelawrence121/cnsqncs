import {GameMode} from "./Types";

export default interface Request {
    name: string,
    mode: GameMode | undefined
    avatar: string | undefined
    game_id: string | undefined,
    entry: string | undefined
}

export interface ClearRequest {
    confirm: boolean
}