import React from "react";
import { useContext } from "react";
import { AuthContext } from "./router"
import { HOME_URL, LOGOUT_URL } from "./urls";
import { useHistory } from "react-router-dom";
import { perform } from "./apiClient";

const Header = () => {
  const {state, dispatch} = useContext(AuthContext)
  const history = useHistory()

  const routeToLogin = () => {
    history.push(HOME_URL)
  }

  const logout = async () => {
    await perform('post', '/logout');
    dispatch({type: "LOGOUT"})
    history.push(LOGOUT_URL)
  }

  const loginText = state.loggedIn ? "Logout" : "Login Page"
  return (
    <nav id="navigation">
      <h1 href="#" className="logo">
        Dynamic Playlist Maker 
      </h1>
      <div style={{textAlign:"right"}}>
        <button onClick={()=>{
          if (state.loggedIn) {
            logout()
          }
          else {
            routeToLogin()
          }

        }}>{loginText}</button>
      </div>
    </nav>
  );
};
export default Header;