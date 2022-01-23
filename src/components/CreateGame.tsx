import React from 'react';
import {GameMode} from "../types/Types";

interface CreateGameProps {
    imageMap: Map<string, any>,
    playerName: string
    avatar: string
    setGameMode: (gameMode: GameMode) => void,
    handleCreateGame: () => void
}

function CreateGame(props: CreateGameProps) {

    return (
        <div className="form-group custom">
            <img className="avatar" src={props.imageMap.get(props.avatar)}/>
            <label className="label title">{props.playerName}</label><br/>
            <div className="row">
                <div className="col-sm-4">
                    <div className="form-group">
                        <button className="btn btn-primary options extended"
                                onClick={() => props.setGameMode(GameMode.EXTENDED)}>Extended
                        </button>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="form-group">
                        <button className="btn btn-primary options classic"
                                onClick={() => props.setGameMode(GameMode.CLASSIC)}>Classic
                        </button>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="form-group">
                        <button className="btn btn-primary options fresh"
                                onClick={() => props.setGameMode(GameMode.FRESH)}>Fresh
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
