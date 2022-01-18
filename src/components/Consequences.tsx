import React, {useEffect, useState} from 'react';
import ConsequencesService from "../ConsequencesService";
import Response, {Entry} from "../types/Response";
import Collapsible from "react-collapsible";
import images from "../avatars/images";
import {GameMode, GameState} from "../types/Types";
import CreateGame from "./CreateGame";

let IMAGE_MAP = new Map<string, any>();
images.map(value => IMAGE_MAP.set(value.toUpperCase(), value))

const Consequences: React.FC = () => {

    const POLL_INTERVAL = 500
    const POLL_GAME_STATES = [GameState.LOBBY_CREATED, GameState.LOBBY_JOINED, GameState.IN_PROGRESS]
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

    function handleCreateMenu() {
        setGameState(GameState.CREATE_OPTIONS)
    }

    function handleCreateGame() {
        setGameState(GameState.LOBBY_CREATED)
    }

    function handleJoin() {
        if (gameState == GameState.HOME) {
            setGameState(GameState.JOIN)
        } else {
            setGameState(GameState.LOBBY_JOINED)
        }
    }

    function handleStart() {
        setGameState(GameState.READY_TO_START)
    }

    function handleSubmit() {
        setEntrySubmit(!entrySubmit)
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

    // game state hook - load data on state change
    useEffect(() => {
        switch (gameState) {
            case GameState.LOBBY_CREATED:
                ConsequencesService.createGame({
                    name: playerName,
                    avatar: avatar,
                    mode: gameMode,
                    game_id: undefined,
                    entry: undefined
                })
                    .then(response => {
                        console.log(response)
                        let responseData = response.data as unknown as Response
                        if (responseData.game_id && responseData.player_name) {
                            setGameCode(responseData.game_id)
                            setPlayerName(responseData.player_name)
                        }
                    })
                    .catch(e => {
                        console.log(e)
                    })
                break
            case GameState.LOBBY_JOINED:
                ConsequencesService.joinGame({
                    name: playerName,
                    avatar: avatar,
                    game_id: gameCode,
                    entry: undefined,
                    mode: undefined
                })
                    .then(response => {
                        console.log(response)
                        let responseData = response.data as unknown as Response
                        if (responseData.game_id && responseData.player_name) {
                            setGameCode(responseData.game_id)
                            setPlayerName(responseData.player_name)
                        }
                    })
                    .catch(e => {
                        setGameCode("Unable to join.")
                        console.log(e)
                    })
                break
            case GameState.READY_TO_START:
                ConsequencesService.startGame({
                    name: playerName,
                    game_id: gameCode,
                    avatar: undefined,
                    entry: undefined,
                    mode: undefined
                })
                    .then(response => {
                        console.log(response)
                        let responseData = response.data as unknown as Response
                        if (responseData.game_state) setGameState(GameState.IN_PROGRESS)
                    })
                    .catch(e => {
                        console.log(e)
                    })
                break
        }
    }, [gameState])

    // submit hook
    useEffect(() => {
        ConsequencesService.postEntry({
            name: playerName,
            avatar: undefined,
            game_id: gameCode,
            entry: entry,
            mode: undefined
        })
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
                console.log("Polling " + playerName + " " + gameCode)
                ConsequencesService.pollGame({
                    name: playerName,
                    avatar: undefined,
                    game_id: gameCode,
                    entry: undefined,
                    mode: undefined
                })
                    .then(response => {
                        console.log(response)
                        let responseData = response.data as unknown as Response
                        // update player list
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
                        if (gameState == GameState.IN_PROGRESS && responseData.waiting_for && responseData.story_state) {
                            let waitingFor = responseData.waiting_for.slice()
                            setWaitingFor(waitingFor)
                            setStoryState(responseData.story_state)
                            // progress to finished state
                            if (responseData.story_state === '<finished>' && responseData.story && responseData.story.length > 0 && responseData.story[0].entries) {
                                setGameState(GameState.STORY_DISPLAY)
                                setCompleteEntries(responseData.story[0].entries)
                            }
                        }
                    })
                    .catch(e => {
                        setGameCode("Unable to join.")
                        console.log(e)
                    })
            }
        }, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [gameState, gameCode, playerName]);


    function getImage(value: any) {
        if (avatar === value.toUpperCase()) {
            return <img className="avatar selected" src={value} onClick={() => setAvatar(value.toUpperCase())}/>
        }
        return <img className="avatar selectable" src={value} onClick={() => setAvatar(value.toUpperCase())}/>
    }

    function getPlayerImage(player: string) {
        if (players.get(player)) {
            return IMAGE_MAP.get(players.get(player) as string)
        }
    }

    function getUserWaitingList() {
        let personList: JSX.Element[] = []
        players.forEach((value, key, map) => {
            if (key !== playerName) {
                personList.push(
                    <div className="waiting-avatar lobby">
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
                return <div className="form-group custom">
                    <div className="avatars">
                        {images.slice(0, 4).map(value => getImage(value))}
                    </div>
                    <br/>
                    <div className="avatars">
                        {images.slice(4, 8).map(value => getImage(value))}
                    </div>
                    <br/>
                    <div className="avatars">
                        {images.slice(8, 12).map(value => getImage(value))}
                    </div>
                    <br/>
                    <input type="text" className="form-control separated" placeholder="Name" value={playerName}
                           onChange={updatePlayerName}/>
                    <button className="btn btn-primary separated" onClick={handleCreateMenu}>Create</button>
                    <button className="btn btn-primary separated" onClick={handleJoin}>Join</button>
                </div>
            case GameState.CREATE_OPTIONS:
                return <CreateGame
                    imageMap={IMAGE_MAP} playerName={playerName} avatar={avatar}
                    setGameMode={setGameMode} handleCreateGame={handleCreateGame}
                />
            case GameState.JOIN:
                return <div className="form-group custom">
                    <img className="avatar" src={IMAGE_MAP.get(avatar)}/><br/>
                    <input type="text" className="form-control separated" placeholder="Game code" value={gameCode}
                           onChange={updateGameCode}/>
                    <button className="btn btn-primary separated" onClick={handleJoin}>Join</button>
                </div>
            case GameState.LOBBY_CREATED:
                let personList = getUserWaitingList()
                return <div className="form-group custom">
                    <img className="avatar" src={IMAGE_MAP.get(avatar)}/><br/>
                    <label className="label other">{gameCode}</label>
                    {personList.length > 0 ?
                        <button className="btn btn-primary separated" onClick={handleStart}>Start</button> : <></>
                    }
                    <br/>
                    {personList}
                </div>
            case GameState.LOBBY_JOINED:
                return <div className="form-group custom">
                    <img className="avatar" src={IMAGE_MAP.get(avatar)}/>
                    <label className="label other">{gameCode}</label>
                    <label className="label other">Waiting</label><br/>
                    {getUserWaitingList()}
                </div>
            case GameState.IN_PROGRESS:
                return <div className="form-group custom input">
                    <img className="avatar" src={IMAGE_MAP.get(avatar)}/>
                    <label className="label title">{storyState}</label>
                    {waitingFor.includes(playerName) ?
                        <>
                            <input type="text" className="form-control separated" value={entry} onChange={updateEntry}/>
                            <button className="btn btn-primary separated" onClick={handleSubmit}>Submit</button>
                        </>
                        : <label className="label info">Submitted</label>
                    }
                    <br/>
                    <div className="waiting-div">
                        {waitingFor.map((player: string) =>
                            <div className="waiting-avatar">
                                <label className="label warning">{player}</label>
                                <img className="avatar waiting" src={getPlayerImage(player)}/>
                                <br/>
                            </div>
                        )}
                    </div>
                </div>
            case GameState.STORY_DISPLAY:
                return <div className="form-group custom">
                    {completeEntries.map((entry: Entry, index: number) =>
                        <Collapsible key={index} easing={"ease-in"} trigger={entry.state}>
                            {entry.entry}
                        </Collapsible>
                    )}
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
