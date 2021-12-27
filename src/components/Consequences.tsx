import React, {useEffect, useState} from 'react';
import ConsequencesService from "../ConsequencesService";
import Response, {Entry} from "../types/Response";
import Collapsible from "react-collapsible";
import images from "../avatars/images";

const enum GameState {
    HOME, JOIN, LOBBY_CREATED, LOBBY_JOINED, READY_TO_START, IN_PROGRESS, STORY_DISPLAY
}

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
                ConsequencesService.createGame({name: playerName, avatar: avatar, game_id: undefined, entry: undefined})
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
                ConsequencesService.joinGame({name: playerName, avatar: avatar, game_id: gameCode, entry: undefined})
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
                    entry: undefined
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
        ConsequencesService.postEntry({name: playerName, avatar: undefined, game_id: gameCode, entry: entry})
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
                ConsequencesService.pollGame({name: playerName, avatar: undefined, game_id: gameCode, entry: undefined})
                    .then(response => {
                        console.log(response)
                        let responseData = response.data as unknown as Response
                        if (responseData.players) {
                            let newPlayers = new Map<string, string>();
                            responseData.players.slice().map(value => newPlayers.set(value.name, value.avatar))
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


    function getImage(value: any) {
        if (avatar === value.toUpperCase()) {
            return <img className="avatar selected" src={value} onClick={() => setAvatar(value.toUpperCase())}/>
        }
        return <img className="avatar" src={value} onClick={() => setAvatar(value.toUpperCase())}/>
    }

    function getComponent(state: GameState) {
        switch (state) {
            case GameState.HOME:
                return <div className="form-group custom">
                    <div className="avatars">
                        {images.slice(0, 6).map(value => getImage(value))}
                    </div>
                    <div className="avatars">
                        {images.slice(6, 12).map(value => getImage(value))}
                    </div>
                    <input type="text" className="form-control separated" placeholder="Name" value={playerName}
                           onChange={updatePlayerName}/>
                    <button className="btn btn-primary separated" onClick={handleCreate}>Create</button>
                    <button className="btn btn-primary separated" onClick={handleJoin}>Join</button>
                </div>
            case GameState.JOIN:
                return <div className="form-group custom">
                    <img className="avatar" src={IMAGE_MAP.get(avatar)}/>
                    <input type="text" className="form-control separated" placeholder="Game code" value={gameCode}
                           onChange={updateGameCode}/>
                    <button className="btn btn-primary separated" onClick={handleJoin}>Join</button>
                </div>
            case GameState.LOBBY_CREATED:
                let personList: JSX.Element[] = []
                players.forEach((value: string, key: string) => {
                    personList.push(<label className="label success">{key}</label>)
                })
                return <div className="form-group custom">
                    <img className="avatar" src={IMAGE_MAP.get(avatar)}/>
                    <label className="label other">{gameCode}</label>
                    <button className="btn btn-primary separated" onClick={handleStart}>Start</button>
                    <br/>
                    {personList}
                </div>
            case GameState.LOBBY_JOINED:
                let personList2: JSX.Element[] = []
                players.forEach((value: string, key: string) => {
                    personList2.push(<label className="label success">{key}</label>)
                })
                return <div className="form-group custom">
                    <img className="avatar" src={IMAGE_MAP.get(avatar)}/>
                    <label className="label other">{gameCode}</label>
                    <label className="label other">Waiting</label><br/>
                    {personList2}
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
