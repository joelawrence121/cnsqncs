import uuid
from enum import Enum

from server import story_service
from server.story_service import StoryState


class Player:
    def __init__(self, name: str, creator: bool, avatar: str):
        self.name = name
        self.creator = creator
        self.avatar = avatar


class Entry:
    def __init__(self, player: Player, state: str, entry: str):
        self.player = player
        self.state = state
        self.entry = entry


class Story:
    def __init__(self, player, state_sequence):
        self.state = StoryState.NOT_STARTED
        self.entries = []
        self.state_sequence = state_sequence
        self.current_player = player

    def post_entry(self, player: Player, entry: str):
        self.state = self.state_sequence[(self.state_sequence.index(self.state) + 1) % len(self.state_sequence)]
        self.entries.append(Entry(player, self.state.value, entry))


class GameState(Enum):
    NOT_STARTED = "<not started>"
    WAITING = "<waiting>"
    FINISHED = "<finished>"


class Game:
    def __init__(self, player_name, avatar, mode):
        self.id = uuid.uuid4().__str__()[:3]
        self.game_state = GameState.NOT_STARTED
        self.state_sequence = story_service.create_sequence(mode)
        self.story_state = self.state_sequence[1]
        self.players = [Player(player_name, True, avatar)]
        self.stories = []
        self.host_player = player_name

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
            # update story state
            self.story_state = self.state_sequence[
                (self.state_sequence.index(self.story_state) + 1) % len(self.state_sequence)]

            # update game state to finished if story finished
            if self.story_state == StoryState.FINISHED:
                self.game_state = GameState.FINISHED

            # swap stories between players
            players = [player.name for player in self.players]
            for i in range(0, len(players)):
                self.stories[i].current_player = players[
                    (players.index(self.stories[i].current_player) + 1) % len(players)]

        return [story for story in self.stories if story.current_player == player_name]

    def start(self):
        self.game_state = GameState.WAITING
        for i in range(0, len(self.players)):
            self.stories.append(Story(self.players[i].name, self.state_sequence))

    def post_entry(self, player_name, entry):
        story = [story for story in self.stories if story.current_player == player_name][0]
        player = [player for player in self.players if player.name == player_name][0]
        story.post_entry(player, entry)

    def restart(self):
        self.game_state = GameState.NOT_STARTED
        self.story_state = self.state_sequence[1]
        self.stories = []
