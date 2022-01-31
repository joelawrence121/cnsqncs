import React from 'react';
import './App.css';
import Consequences from "./Consequences";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import ClearScreen from "./ClearScreen";
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";

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
                        <ClearScreen/>
                    </div>
                </Route>
                <Route path="/">
                    <div className="App">
                        <div id="particle-container">
                            {getParticles(30)}
                            <Navbar bg="light" expand="lg" className={"transparent"}>
                                <Container>
                                    <Navbar.Brand href="/">Consequences</Navbar.Brand>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto">
                                            <Nav.Link href="/">Home</Nav.Link>
                                            <Nav.Link href="/">About</Nav.Link>
                                        </Nav>
                                    </Navbar.Collapse>
                                </Container>
                            </Navbar>
                            <Consequences/>
                        </div>
                    </div>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
