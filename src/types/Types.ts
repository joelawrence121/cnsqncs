export enum GameMode {
    CLASSIC = "classic",
    EXTENDED = "extended",
    FRESH = "fresh"
}

export enum GameState {
    HOME,
    JOIN,
    CREATE_OPTIONS,
    CREATE_GAME,
    LOBBY_CREATED,
    JOIN_GAME,
    LOBBY_JOINED,
    READY_TO_START,
    IN_PROGRESS,
    STORY_DISPLAY,
    PLAY_AGAIN,
    FETCHING
}