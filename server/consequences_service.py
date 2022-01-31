from server.client_json import EntryRequest
from server.domain import Game, GameState, Session


class ConsequencesService:
    def __init__(self):
        self.games = {}
        self.sessions = {}

    def __get_response_obj(self, game: Game):
        return {
            'game_id': game.id,
            'game_state': game.game_state.value,
            'story_state': game.story_state.value,
            'waiting_for': game.get_waiting_for(),
            'players': game.get_players(),
            'host_player': game.host_player
        }

    def create_game(self, player_name, avatar, mode):
        if len(player_name) < 1:
            player_name = "Player 1"

        game = Game(player_name, avatar, mode)
        self.games[game.id] = game
        response_ob = self.__get_response_obj(game)
        response_ob['player_name'] = player_name
        return response_ob

    def join_game(self, game_id, player_name, avatar):
        if game_id not in self.games.keys():
            return {'message': 'game_id: ' + game_id + ' does not exist.'}
        # deal with same names
        if player_name in [player.name for player in self.games[game_id].players]:
            player_name += " (" + str(
                len([player.name for player in self.games[game_id].players if player_name in player.name])) + ")"
        if len(player_name) < 1:
            player_name = "Player " + str((len(self.games[game_id].players)) + 1)

        self.games[game_id].player_join(player_name, avatar)
        response_ob = self.__get_response_obj(self.games[game_id])
        response_ob['player_name'] = player_name
        return response_ob

    def poll_game(self, player_name, game_id, session_id, game_state):
        # if no player_name, game_id provided return session details for restate
        if len(player_name) == 0 or len(game_id) == 0 is None:
            if session_id is None or session_id not in self.sessions.keys():
                return {'message': 'session_id is not recognised.'}
            session = self.sessions[session_id]
            return {'game_id': session.game_id, 'player_name': session.name, 'game_state': session.game_state}

        if game_id not in self.games.keys():
            return {'message': 'game_id: ' + game_id + ' does not exist.'}

        # if session doesn't exist already and game id provided, create
        if session_id not in self.sessions.keys():
            self.sessions[session_id] = Session(player_name, game_id, game_state)

        self.sessions[session_id].game_state = game_state
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

    def restart_game(self, game_id):
        if game_id not in self.games.keys():
            return {'message': 'game_id: ' + game_id + ' does not exist.'}

        self.games[game_id].restart()
        return self.__get_response_obj(self.games[game_id])

    def clear_games(self, confirm: bool):
        if confirm:
            return_obj = {"cleared": len(self.games)}
            self.games = {}
        else:
            return_obj = {"games": []}
            for game_id in self.games:
                if self.games[game_id].game_state != GameState.FINISHED:
                    return_obj["games"].append(game_id)
        return return_obj
