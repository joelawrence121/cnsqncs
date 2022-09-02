import React, {useEffect, useState} from 'react';
import ConsequencesService from "../ConsequencesService";
import Response, {Entry} from "../types/Response";
import Collapsible from "react-collapsible";
import images from "../avatars/images";
import CreateGame from "./CreateGame";
import {StorySubmission} from "./StorySubmission";
import {RequestBuilder} from "../types/RequestBuilder";
import HomeScreen from "./HomeScreen";
import {GameMode, GameState} from "../types/Types";
import {useHistory, useLocation} from 'react-router';
import {v4 as uuidv4} from 'uuid';

let IMAGE_MAP = new Map<string, any>();
images.map(value => IMAGE_MAP.set(value.toUpperCase(), value))

const Consequences: React.FC = () => {

    const POLL_INTERVAL = 1500
    const MOBILE_WIDTH = 400
    const history = useHistory();
    const location = useLocation();
    const POLL_GAME_STATES = [GameState.LOBBY_CREATED, GameState.LOBBY_JOINED, GameState.IN_PROGRESS, GameState.STORY_DISPLAY, GameState.FETCHING]
    const [innerWidth] = useState(window.innerWidth)

    const [sessionId, setSessionId] = useState<string>();
    const [gameState, setGameState] = useState<GameState>(GameState.HOME)
    const [playerName, setPlayerName] = useState('')
    const [entry, setEntry] = useState('')
    const [entrySubmit, setEntrySubmit] = useState(false)
    const [players, setPlayers] = useState<Map<string, string>>(new Map<string, string>())
    const [waitingFor, setWaitingFor] = useState<string[]>([])
    const [storyState, setStoryState] = useState<string>('')
    const [gameCode, setGameCode] = useState('')
    const [completeEntries, setCompleteEntries] = useState<Entry[]>([])
    const [avatar, setAvatar] = useState<string>('')
    const [gameMode, setGameMode] = useState<GameMode>(GameMode.CLASSIC)
    const [hostPlayer, setHostPlayer] = useState('')

    function handleCreateMenu() {
        setGameState(GameState.CREATE_OPTIONS)
    }

    function handleCreateGame() {
        setGameState(GameState.CREATE_GAME)
    }

    function handleJoin() {
        if (gameState == GameState.HOME) {
            setGameState(GameState.JOIN)
        } else {
            setGameState(GameState.JOIN_GAME)
        }
    }

    function handleStart() {
        setGameState(GameState.READY_TO_START)
    }

    function handleSubmit() {
        setEntrySubmit(!entrySubmit)
    }

    function handlePlayAgain() {
        setGameState(GameState.PLAY_AGAIN)
    }

    const updatePlayerName = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setPlayerName(e.target.value)
    }

    const updateGameCode = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setGameCode(e.target.value)
    }

    const updateEntry = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setEntry(e.target.value)
    }

    function createSessionId() {
        const sessionId = uuidv4();
        const params = new URLSearchParams({["sessionId"]: sessionId});
        history.replace({pathname: location.pathname, search: params.toString()});
        setSessionId(sessionId);
    }

    // game state hook - load data on state change
    useEffect(() => {
        switch (gameState) {
            case GameState.HOME:
                // check for session id in url parameter, poll to get details back
                const urlParams = new URLSearchParams(location.search).get("sessionId")
                if (urlParams) {
                    setSessionId(urlParams)
                    setGameState(GameState.FETCHING)
                }
                break
            case GameState.CREATE_GAME:
                ConsequencesService.createGame(new RequestBuilder().playerName(playerName).avatar(avatar).mode(gameMode).build())
                    .then(response => {
                        console.log(response)
                        let responseData = response.data as unknown as Response
                        if (responseData.game_id && responseData.player_name) {
                            setGameCode(responseData.game_id)
                            setPlayerName(responseData.player_name)
                            setGameState(GameState.LOBBY_CREATED)
                            createSessionId();
                        }
                    })
                    .catch(e => {
                        console.log(e)
                    })
                break
            case GameState.JOIN_GAME:
                ConsequencesService.joinGame(new RequestBuilder().playerName(playerName).game_id(gameCode).avatar(avatar).mode(gameMode).build())
                    .then(response => {
                        console.log(response)
                        let responseData = response.data as unknown as Response
                        if (responseData.game_id && responseData.player_name) {
                            setGameCode(responseData.game_id)
                            setPlayerName(responseData.player_name)
                            setGameState(GameState.LOBBY_JOINED)
                            createSessionId();
                        }
                    })
                    .catch(e => {
                        setGameCode("Unable to join.")
                        console.log(e)
                    })
                break
            case GameState.READY_TO_START:
                ConsequencesService.startGame(new RequestBuilder().playerName(playerName).game_id(gameCode).build())
                    .then(response => {
                        console.log(response)
                        let responseData = response.data as unknown as Response
                        if (responseData.game_state) setGameState(GameState.IN_PROGRESS)
                    })
                    .catch(e => {
                        console.log(e)
                    })
                break
            case GameState.PLAY_AGAIN:
                ConsequencesService.restartGame(new RequestBuilder().game_id(gameCode).build())
                    .then(response => {
                        console.log(response)
                        let responseData = response.data as unknown as Response
                        if (responseData.game_state) {
                            if (playerName == hostPlayer) setGameState(GameState.LOBBY_CREATED)
                            else setGameState(GameState.LOBBY_JOINED)
                            setStoryState('')
                        }
                    })
                    .catch(e => {
                        console.log(e)
                    })
                break
        }
    }, [gameState])

    // entry submission hook
    useEffect(() => {
        ConsequencesService.postEntry(new RequestBuilder().playerName(playerName).game_id(gameCode).entry(entry).build())
            .then(response => {
                console.log(response)
                let responseData = response.data as unknown as Response
                if (responseData.waiting_for) {
                    let newWaitingFor = responseData.waiting_for.slice()
                    setWaitingFor(newWaitingFor)
                    setEntry(() => "")
                }
            })
            .catch(e => {
                console.log(e)
            })
    }, [entrySubmit])

    // polling hook
    useEffect(() => {
        const interval = setInterval(() => {
            if (POLL_GAME_STATES.includes(gameState)) {
                ConsequencesService.pollGame(new RequestBuilder().playerName(playerName).game_id(gameCode).session_id(sessionId).game_state(gameState).build())
                    .then(response => {
                        console.log(response)
                        let responseData = response.data as unknown as Response
                        // update player list
                        if (responseData.host_player) setHostPlayer(responseData.host_player)
                        if (responseData.players) {
                            let newPlayers = new Map<string, string>();
                            responseData.players.slice().map(value => newPlayers.set(value.name, value.avatar))
                            setPlayers(newPlayers)
                        }
                        // transition to in progress if host started game
                        if (gameState == GameState.LOBBY_JOINED && responseData.story) {
                            if (responseData.story.length > 0) setGameState(GameState.IN_PROGRESS)
                        }
                        // story progression
                        if ((gameState == GameState.IN_PROGRESS || gameState == GameState.STORY_DISPLAY)
                            && responseData.waiting_for && responseData.story_state) {
                            let waitingFor = responseData.waiting_for.slice()
                            setWaitingFor(waitingFor)
                            setStoryState(responseData.story_state)
                            // progress to finished state
                            if (responseData.story_state === '<finished>' && responseData.story && responseData.story.length > 0 && responseData.story[0].entries) {
                                setGameState(GameState.STORY_DISPLAY)
                                setCompleteEntries(responseData.story[0].entries)
                            }
                        }
                        // play again progression
                        if (gameState == GameState.STORY_DISPLAY && responseData.game_state == '<not started>') {
                            setGameState(GameState.LOBBY_JOINED)
                        }
                        // reinstate from session
                        if (responseData.player_name && responseData.game_id && responseData.game_state) {
                            setPlayerName(responseData.player_name)
                            setGameCode(responseData.game_id)
                            setGameState(parseInt(responseData.game_state))
                        }
                        if (avatar.length == 0 && players && playerName) {
                            const avatarUrl = players.get(playerName)
                            setAvatar(avatarUrl ? avatarUrl : '')
                        }
                    })
                    .catch(e => {
                        setGameCode("Unable to join.")
                        console.log(e)
                    })
            }
        }, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [gameState, gameCode, playerName, sessionId, players]);

    function getUserWaitingList() {
        let personList: JSX.Element[] = []
        players.forEach((value, key, map) => {
            if (key !== playerName) {
                personList.push(
                    <div className="waiting-avatar">
                        <label className="label success">{key}</label>
                        <img className="avatar waiting" src={IMAGE_MAP.get(value)}/>
                        <br/>
                    </div>
                )
            }
        })
        return personList;
    }

    function getComponent(state: GameState) {
        switch (state) {
            case GameState.HOME:
                return <HomeScreen
                    avatar={avatar} setAvatar={setAvatar} playerName={playerName}
                    updatePlayerName={updatePlayerName} handleJoin={handleJoin} handleCreateMenu={handleCreateMenu}
                />
            case GameState.CREATE_OPTIONS:
            case GameState.CREATE_GAME:
                return <CreateGame
                    imageMap={IMAGE_MAP} playerName={playerName} avatar={avatar}
                    setGameMode={setGameMode} handleCreateGame={handleCreateGame}
                />
            case GameState.JOIN:
            case GameState.JOIN_GAME:
                return <div className="form-group custom">
                    <img className={innerWidth > MOBILE_WIDTH ? "avatar" : "avatar_mobile"} src={IMAGE_MAP.get(avatar)}/><br/>
                    <input type="text" className="form-control separated" placeholder="Game code" value={gameCode}
                           onChange={updateGameCode}/>
                    <button className="btn btn-primary separated" onClick={handleJoin}>Join</button>
                </div>
            case GameState.LOBBY_CREATED:
                let personList = getUserWaitingList()
                return <div className="form-group custom">
                    <img className={innerWidth > MOBILE_WIDTH ? "avatar" : "avatar_mobile"} src={IMAGE_MAP.get(avatar)}/><br/>
                    <label className="label other">{gameCode}</label>
                    {personList.length > 0 ?
                        <button className="btn btn-primary separated" onClick={handleStart}>Start</button> : <></>
                    }
                    <br/>
                    <div className="waiting-div">{personList}</div>
                </div>
            case GameState.LOBBY_JOINED:
                return <div className="form-group custom">
                    <img className={innerWidth > MOBILE_WIDTH ? "avatar" : "avatar_mobile"} src={IMAGE_MAP.get(avatar)}/>
                    <label className="label other">{gameCode}</label>
                    <label className="label other">Waiting</label><br/>
                    <div className="waiting-div">{getUserWaitingList()}</div>
                </div>
            case GameState.IN_PROGRESS:
                return <StorySubmission
                    imageMap={IMAGE_MAP} players={players} avatar={avatar} storyState={storyState}
                    waitingFor={waitingFor} playerName={playerName} entry={entry}
                    updateEntry={updateEntry}
                    handleSubmit={handleSubmit}/>
            case GameState.STORY_DISPLAY:
                return <div className="form-group custom">
                    {completeEntries.map((entry: Entry, index: number) =>
                        <Collapsible key={index} easing={"ease-in"} trigger={entry.state}>
                            {entry.entry}
                        </Collapsible>
                    )}
                    {hostPlayer == playerName ?
                        <button className="btn btn-primary separated" onClick={handlePlayAgain}>Play
                            again</button> : <></>
                    }
                </div>
            case GameState.FETCHING:
                return <div className="form-group custom">
                    <label className="label other">Fetching</label><br/>
                </div>
        }
    }

    return (
        <div className="section inner">
            {getComponent(gameState)}
        </div>
    );
}

export default Consequences;
