export interface Player {
    name: string
    creator: boolean
    avatar: string
}

export interface Entry {
    player: Player
    state: string
    entry: string
}

interface Story {
    state: string | undefined
    entries: Entry[] | undefined
    current_player: string | undefined
}

export default interface Response {
    game_id: string | undefined,
    game_state: string | undefined,
    story_state: string | undefined,
    waiting_for: string[] | undefined,
    players: Player[] | undefined,
    story: Story[] | undefined,
    player_name: string | undefined,
    host_player: string | undefined
}

export interface ClearResponse {
    games: string[] | undefined,
    cleared: number | undefined,
}