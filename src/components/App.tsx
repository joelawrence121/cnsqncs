import React from 'react';
import './App.css';
import Consequences from "./Consequences";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import ClearScreen from "./ClearScreen";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/clear">
                    <div className="App">
                        <ClearScreen/>
                    </div>
                </Route>
                <Route path="/">
                    <div className="App">
                        <div id="particle-container">
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <Consequences/>
                        </div>
                    </div>
                </Route>
            </Switch>
        </Router>

    );
}

export default App;
