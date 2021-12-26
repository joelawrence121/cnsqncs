from objects.api import EntryRequest
from objects.domain import Game, GameState


class ConsequencesService:
    def __init__(self):
        self.games = {}

    def __get_response_obj(self, game: Game):
        return {
            'game_id': game.id,
            'game_state': game.game_state.value,
            'story_state': game.story_state.value,
            'waiting_for': game.get_waiting_for(),
            'players': game.get_players()
        }

    def create_game(self, player_name):
        if len(player_name) < 1:
            player_name = "Player 1"

        game = Game(player_name)
        self.games[game.id] = game
        return self.__get_response_obj(game)

    def join_game(self, game_id, player_name):
        if game_id not in self.games.keys():
            return {'message': 'game_id: ' + game_id + ' does not exist.'}

        if len(player_name) < 1:
            player_name = "Player " + str((len(self.games[game_id].players)) + 1)

        self.games[game_id].player_join(player_name)
        return self.__get_response_obj(self.games[game_id])

    def poll_game(self, player_name, game_id):
        if game_id not in self.games.keys():
            return {'message': 'game_id: ' + game_id + ' does not exist.'}

        game_obj = self.__get_response_obj(self.games[game_id])
        game_obj['story'] = self.games[game_id].poll_game(player_name)
        return game_obj

    def start_game(self, game_id):
        if game_id not in self.games.keys():
            return {'message': 'game_id: ' + game_id + ' does not exist.'}

        self.games[game_id].start()
        return self.__get_response_obj(self.games[game_id])

    def post_entry(self, request: EntryRequest):
        if request.game_id not in self.games.keys():
            return {'message': 'game_id: ' + request.game_id + ' does not exist.'}
        if self.games[request.game_id].game_state != GameState.WAITING:
            return {'message': 'game is not ready'}

        self.games[request.game_id].post_entry(request.name, request.entry)
        return self.__get_response_obj(self.games[request.game_id])
