import uuid
from enum import Enum


class Player:
    def __init__(self, name: str, creator: bool, avatar: str):
        self.name = name
        self.creator = creator
        self.avatar = avatar


class StoryState(Enum):
    NOT_STARTED = "<ready to start>"
    MAN = "(man's name)"
    WOMAN = "met (woman's name)"
    MET = 'in / at'
    HE_WORE = 'he wore'
    SHE_WORE = 'she wore'
    HE_SAID = 'he said'
    SHE_SAID = 'she said'
    CONSEQUENCE = 'and the consequence was'
    FINISHED = "<finished>"


class Entry:
    def __init__(self, player: Player, state: str, entry: str):
        self.player = player
        self.state = state
        self.entry = entry


class Story:
    STATE_SEQUENCE = [
        StoryState.NOT_STARTED,
        StoryState.MAN,
        StoryState.WOMAN,
        StoryState.MET,
        StoryState.HE_WORE,
        StoryState.SHE_WORE,
        StoryState.HE_SAID,
        StoryState.SHE_SAID,
        StoryState.CONSEQUENCE,
        StoryState.FINISHED
    ]

    def __init__(self, player):
        self.state = StoryState.NOT_STARTED
        self.entries = []
        self.current_player = player

    def post_entry(self, player: Player, entry: str):
        self.state = self.STATE_SEQUENCE[(self.STATE_SEQUENCE.index(self.state) + 1) % len(self.STATE_SEQUENCE)]
        self.entries.append(Entry(player, self.state.value, entry))


class GameState(Enum):
    NOT_STARTED = "<not started>"
    WAITING = "<waiting>"
    FINISHED = "<finished>"


class Game:
    def __init__(self, player_name, avatar):
        self.id = uuid.uuid4().__str__()[:3]
        self.game_state = GameState.NOT_STARTED
        self.story_state = StoryState.MAN
        self.players = [Player(player_name, True, avatar)]
        self.stories = []

    def get_waiting_for(self):
        return set([story.current_player for story in self.stories if story.state != self.story_state])

    def get_players(self):
        return self.players

    def player_join(self, player_name, avatar):
        self.players.append(Player(player_name, False, avatar))

    def poll_game(self, player_name):
        waiting = [self.get_waiting_for()]

        # progress round if done
        if len(waiting[0]) == 0 and len(self.players) > 1 and self.game_state != GameState.NOT_STARTED:
            self.story_state = Story.STATE_SEQUENCE[
                (Story.STATE_SEQUENCE.index(self.story_state) + 1) % len(Story.STATE_SEQUENCE)]

            players = [player.name for player in self.players]
            for i in range(0, len(players)):
                self.stories[i].current_player = players[
                    (players.index(self.stories[i].current_player) + 1) % len(players)]

        return [story for story in self.stories if story.current_player == player_name]

    def start(self):
        self.game_state = GameState.WAITING
        for i in range(0, len(self.players)):
            self.stories.append(Story(self.players[i].name))

    def post_entry(self, player_name, entry):
        story = [story for story in self.stories if story.current_player == player_name][0]
        player = [player for player in self.players if player.name == player_name][0]
        story.post_entry(player, entry)
