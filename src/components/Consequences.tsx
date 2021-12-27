import React, {useEffect, useState} from 'react';
import ConsequencesService from "../ConsequencesService";
import Response, {Entry} from "../types/Response";
import Collapsible from "react-collapsible";

const enum GameState {
    HOME, JOIN, LOBBY_CREATED, LOBBY_JOINED, READY_TO_START, IN_PROGRESS, STORY_DISPLAY
}

const Consequences: React.FC = () => {

    const POLL_INTERVAL = 500
    const POLL_GAME_STATES = [GameState.LOBBY_CREATED, GameState.LOBBY_JOINED, GameState.IN_PROGRESS]
    const [gameState, setGameState] = useState<GameState>(GameState.HOME)
    const [playerName, setPlayerName] = useState('')
    const [entry, setEntry] = useState('')
    const [entrySubmit, setEntrySubmit] = useState(false)
    const [players, setPlayers] = useState<string[]>([])
    const [waitingFor, setWaitingFor] = useState<string[]>([])
    const [storyState, setStoryState] = useState<string>('')
    const [gameCode, setGameCode] = useState('')
    const [completeEntries, setCompleteEntries] = useState<Entry[]>([])

    function handleCreate() {
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

    // page data hook
    useEffect(() => {
        switch (gameState) {
            case GameState.LOBBY_CREATED:
                ConsequencesService.createGame({name: playerName, game_id: undefined, entry: undefined})
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
                ConsequencesService.joinGame({name: playerName, game_id: gameCode, entry: undefined})
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
                ConsequencesService.startGame({name: playerName, game_id: gameCode, entry: undefined})
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
        ConsequencesService.postEntry({name: playerName, game_id: gameCode, entry: entry})
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
                ConsequencesService.pollGame({name: playerName, game_id: gameCode, entry: undefined})
                    .then(response => {
                        console.log(response)
                        let responseData = response.data as unknown as Response
                        if (responseData.players) {
                            let newPlayers = responseData.players.slice()
                            setPlayers(newPlayers)
                        }
                        if (gameState == GameState.LOBBY_JOINED && responseData.story) {
                            if (responseData.story.length > 0) setGameState(GameState.IN_PROGRESS)
                        }
                        if (gameState == GameState.IN_PROGRESS && responseData.waiting_for && responseData.story_state) {
                            let waitingFor = responseData.waiting_for.slice()
                            setWaitingFor(waitingFor)
                            setStoryState(responseData.story_state)
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

    function getComponent(state: GameState) {
        switch (state) {
            case GameState.HOME:
                return <div className="form-group custom">
                    <input type="text" className="form-control separated" placeholder="Name" value={playerName}
                           onChange={updatePlayerName}/>
                    <button className="btn btn-primary separated" onClick={handleCreate}>Create</button>
                    <button className="btn btn-primary separated" onClick={handleJoin}>Join</button>
                </div>
            case GameState.JOIN:
                return <div className="form-group custom">
                    <input type="text" className="form-control separated" placeholder="Game code" value={gameCode}
                           onChange={updateGameCode}/>
                    <button className="btn btn-primary separated" onClick={handleJoin}>Join</button>
                </div>
            case GameState.LOBBY_CREATED:
                return <div className="form-group custom">
                    <label className="label other">{gameCode}</label>
                    <button className="btn btn-primary separated" onClick={handleStart}>Start</button>
                    <br/>
                    {players.map((player: string) => <label className="label success">{player}</label>)}
                </div>
            case GameState.LOBBY_JOINED:
                return <div className="form-group custom">
                    <label className="label other">{gameCode}</label>
                    <label className="label other">Waiting</label><br/>
                    {players.map((player: string) => <label className="label success">{player}</label>)}
                </div>
            case GameState.IN_PROGRESS:
                return <div className="form-group custom input">
                    <label className="label title">{storyState}</label>
                    <input type="text" className="form-control separated" value={entry} onChange={updateEntry}/>
                    {waitingFor.includes(playerName) ?
                        <button className="btn btn-primary separated" onClick={handleSubmit}>Submit</button>
                        : <label className="label info">Submitted</label>
                    }
                    <br/>
                    {waitingFor.map((player: string) => <label className="label warning">{player}</label>)}
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
