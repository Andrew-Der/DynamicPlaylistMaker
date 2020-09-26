import React from "react";
import { useState, useContext } from "react";
import { AuthContext } from "./router"
import { LOGIN_URL } from "./urls";
import { useHistory } from "react-router-dom";
import { perform } from "./apiClient";

const Header = () => {
  const {state, dispatch} = useContext(AuthContext)
  const history = useHistory()

  const routeToLogin = () => {
    history.push(LOGIN_URL)
  }

  const logout = async () => {
    await perform('post', '/logout');
    dispatch({type: "LOGOUT"})
  }

  const loginText = state.loggedIn ? "Logout" : "Login"
  return (
    <nav id="navigation">
      <h1 href="#" className="logo">
        Dynamic Playlist Maker 
      </h1>
      <button onClick={()=>{
        
        if (state.loggedIn) {
          logout()
        }
        else {
          routeToLogin()
        }

      }}>{loginText}</button>
    </nav>
  );
};
export default Header;