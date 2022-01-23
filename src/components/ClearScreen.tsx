import React, {useEffect, useState} from 'react';
import ConsequencesService from "../ConsequencesService";
import {ClearResponse} from "../types/Response";

const enum ScreenState {
    PENDING, GET_GAMES, SHOW_GAMES, CLEAR_CONFIRM, SHOW_CLEARED
}

const ClearScreen: React.FC = () => {

    const [screenState, setScreenState] = useState<ScreenState>(ScreenState.PENDING)
    const [activeGames, setActiveGames] = useState<string []>([])
    const [statusMessage, setStatusMessage] = useState<string>("")

    useEffect(() => {
        switch (screenState) {
            case ScreenState.PENDING:
                break
            case ScreenState.GET_GAMES:
                ConsequencesService.getActiveGames({confirm: false})
                    .then(response => {
                        console.log(response)
                        let responseData = response.data as unknown as ClearResponse
                        if (responseData.games) {
                            setActiveGames(responseData.games.slice())
                        }
                    })
                    .catch(e => {
                        setActiveGames(["Unable to connect."])
                        console.log(e)
                    })
                setScreenState(ScreenState.SHOW_GAMES)
                break
            case ScreenState.SHOW_GAMES:
                break
            case ScreenState.CLEAR_CONFIRM:
                ConsequencesService.getActiveGames({confirm: true})
                    .then(response => {
                        console.log(response)
                        let responseData = response.data as unknown as ClearResponse
                        if (responseData.cleared) {
                            setStatusMessage(responseData.cleared + " games cleared.")
                        }
                    })
                    .catch(e => {
                        setStatusMessage("Unable to clear.")
                        console.log(e)
                    })
                setScreenState(ScreenState.SHOW_CLEARED)
                break
            case ScreenState.SHOW_CLEARED:
                break
        }
    }, [screenState])

    function handleGet() {
        setScreenState(ScreenState.GET_GAMES)
    }

    function handleClear() {
        setScreenState(ScreenState.CLEAR_CONFIRM)
    }

    function getComponent(state: ScreenState) {
        switch (state) {
            case ScreenState.PENDING:
            case ScreenState.GET_GAMES:
                return <div className="form-group custom">
                    <button className="btn btn-primary separated info" onClick={handleGet}>Get active games</button>
                    <button className="btn btn-primary separated warning" onClick={handleClear}>Clear games</button>
                </div>
            case ScreenState.SHOW_GAMES:
            case ScreenState.CLEAR_CONFIRM:
                return <div className="form-group custom">
                    {activeGames.map(value => <label className="label warning">{value}</label>)}
                    <button className="btn btn-primary separated warning" onClick={handleClear}>Clear games</button>
                </div>
            case ScreenState.SHOW_CLEARED:
                return <div className="form-group custom">
                    <label className="label info">{statusMessage}</label>
                </div>
        }
    }

    return (
        <div className="section inner">
            {getComponent(screenState)}
        </div>
    );
}

export default ClearScreen;
