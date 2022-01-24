import React, {useState} from 'react';
import {GameMode} from "../types/Types";

interface CreateGameProps {
    imageMap: Map<string, any>,
    playerName: string
    avatar: string
    setGameMode: (gameMode: GameMode) => void,
    handleCreateGame: () => void
}

let buttonStyles = new Map<GameMode, string>([
    [GameMode.CLASSIC, "btn btn-primary options classic"],
    [GameMode.EXTENDED, "btn btn-primary options extended"],
    [GameMode.FRESH, "btn btn-primary options fresh"]
]);

function CreateGame(props: CreateGameProps) {

    const[selectedMode, setSelectedMode] = useState(GameMode.CLASSIC)

    function getButtonStyle(gameMode: GameMode) {
        if (gameMode == selectedMode) {
            return buttonStyles.get(gameMode) + " mode_selected"
        }
        return buttonStyles.get(gameMode)
    }

    return (
        <div className="form-group custom">
            <img className="avatar" src={props.imageMap.get(props.avatar)}/>
            <label className="label title">{props.playerName}</label><br/>
            <div className="row">
                <div className="col-sm-4">
                    <div className="form-group">
                        <button className={getButtonStyle(GameMode.EXTENDED)}
                                onClick={() => {
                                    props.setGameMode(GameMode.EXTENDED)
                                    setSelectedMode(GameMode.EXTENDED)
                                }}>Extended
                        </button>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="form-group">
                        <button className={getButtonStyle(GameMode.CLASSIC)}
                                onClick={() => {
                                    props.setGameMode(GameMode.CLASSIC)
                                    setSelectedMode(GameMode.CLASSIC)
                                }}>Classic
                        </button>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="form-group">
                        <button className={getButtonStyle(GameMode.FRESH)}
                                onClick={() => {
                                    props.setGameMode(GameMode.FRESH)
                                    setSelectedMode(GameMode.FRESH)
                                }}>Fresh
                        </button>
                    </div>
                </div>
            </div>
            <br/>
            <button className="btn btn-primary separated thick" onClick={props.handleCreateGame}>Create</button>
        </div>
    );
}

export default CreateGame;
