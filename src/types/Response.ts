
interface Story {

}

export default interface Response {
    game_id: string | undefined,
    game_state: string | undefined,
    story_state: string | undefined,
    waiting_for: string[] | undefined,
    players: string[] | undefined,
    story: Story[] | undefined
}