import React from "react";
import { Container } from "@material-ui/core";
import NavbarLoginStatus from "./HeaderComponents/NavbarLoginStatus"
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { ABOUT_URL, CREATE_PLAYLIST } from "./urls";

const Header = () => {

  return (
    <Container>
    <Navbar id="nagivation" expand="md">
      <Navbar.Brand href={ABOUT_URL}>playlistifier.space</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav" >
      <Nav> 
        <Nav.Item>
          <Nav.Link href={ABOUT_URL}>About</Nav.Link>
        </Nav.Item>
        {/* <Nav.Item>
          <Nav.Link href="/home">Donate</Nav.Link>
        </Nav.Item> */}
        <Nav.Item>
          <Nav.Link href={CREATE_PLAYLIST}>Create Playlist</Nav.Link>
        </Nav.Item>
        <NavbarLoginStatus/>
      </Nav>
    </Navbar.Collapse>
    </Navbar>
    </Container>
  );
};
export default Header;