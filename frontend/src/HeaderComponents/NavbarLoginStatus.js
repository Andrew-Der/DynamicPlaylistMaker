import React from "react";
import { useContext } from "react";
import { AuthContext, isAuthenticated } from "./../router"
import { LOGIN_URL, LOGOUT_URL } from "./../urls";
import { useHistory } from "react-router-dom";
import { perform } from "./../apiClient";
import Nav from "react-bootstrap/Nav";

const NavbarLoginStatus = () => {
  const {state, dispatch} = useContext(AuthContext)
  const history = useHistory()

  const routeToLogin = () => {
    history.push(LOGIN_URL)
  }

  const logout = async () => {
    await perform('post', '/logout');
    dispatch({type: "LOGOUT"})
    history.push(LOGOUT_URL)
  }
  const isAuthedIn = isAuthenticated()
  const loginText = isAuthedIn ? "Sign Out" : "Sign In Page";
  return (
    <Nav.Item onClick={() => {
        if (isAuthedIn) {
          logout()
        } 
        else {
          routeToLogin()
        }
    }}>
        <Nav.Link>{loginText}</Nav.Link>
    </Nav.Item>
  );
};
export default NavbarLoginStatus;