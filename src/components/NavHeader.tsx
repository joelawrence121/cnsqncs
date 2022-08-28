import {Container, Nav, Navbar} from "react-bootstrap";
import React from "react";

const NavHeader: React.FC = () => {

    return (
        <Navbar bg="light" expand="lg" className={"transparent"}>
            <Container>
                <Navbar.Brand href="/">Consequences</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Play</Nav.Link>
                        <Nav.Link href="/about">About</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavHeader;