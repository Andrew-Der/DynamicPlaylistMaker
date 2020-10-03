import React from "react";
import { Container } from "@material-ui/core";
import NavbarLoginStatus from "./HeaderComponents/NavbarLoginStatus"
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

const Header = () => {

  return (
    <Container>
    <Navbar id="nagivation" expand="md">
      <Navbar.Brand href="#home">DynamicSpotifyPlayer</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav" >
      <Nav> 
        <Nav.Item>
          <Nav.Link href="home">About</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="home">Donate</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="create_playlist">Create Playlist</Nav.Link>
        </Nav.Item>
        <NavbarLoginStatus/>
      </Nav>
    </Navbar.Collapse>
    </Navbar>
    </Container>
  );
};
export default Header;