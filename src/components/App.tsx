import React from 'react';
import './App.css';
import Consequences from "./Consequences";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import ClearScreen from "./ClearScreen";
import {Container, Nav, Navbar} from "react-bootstrap";
import AboutPage from "./AboutPage";
import NavHeader from "./NavHeader";

function getParticles(amount: number) {
    let particleList: JSX.Element[] = []
    for (let i = 0; i < amount; i++) {
        particleList.push(<div className="particle"></div>)
    }
    return particleList
}

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/clear">
                    <div className="App">
                        {getParticles(10)}
                        <NavHeader/>
                        <ClearScreen/>
                    </div>
                </Route>
                <Route path="/about">
                    <div className="App">
                        <NavHeader/>
                        <AboutPage/>
                    </div>
                </Route>
                <Route path="/">
                    <div className="App">
                        <div id="particle-container">
                            {getParticles(30)}
                            <NavHeader/>
                            <Consequences/>
                        </div>
                    </div>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
