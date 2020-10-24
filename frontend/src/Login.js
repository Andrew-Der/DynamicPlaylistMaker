import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { CREATE_PLAYLIST } from "./urls";
import axios from 'axios';
import { useState, useContext } from "react";
import { AuthContext, isAuthenticated } from "./router";

var cid = "9ec49d21b920488fa9f49b2ea2879ea5"

function generateRandomString(length) {
  var text = '' 
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i=0; i < length; i++) 
    text = text.concat(possible[Math.floor(Math.random() * possible.length)])
  return text
}

function getAuthCodeAndState(search) {
  var words = search.split('&')
  if (words.length == 2 && words[0] && words[1]) {
    words[0] = words[0].replace('?code=', '')
    words[1] = words[1].replace('state=', '')
  }
  return words
}

function getSpotifyLoginRedirectUrl() {
  /**
   * Get the url that initiates the login with Spotify.
   * The user should be redirected here to begin the login process.
   * More about SP scope info : https://developer.spotify.com/documentation/general/guides/scopes/
   * 
   * @return {string}
   */
  const API_URL = 'https://accounts.spotify.com/authorize'
  const redirect_uri = `http://${process.env.REACT_APP_SPOTIFY_REDIRECT_TO_CLIENT_HOSTNAME}/login` 
  const token_state = generateRandomString(16)
  const scope = "user-library-read playlist-modify-public playlist-read-private"
  const URL = API_URL + `?client_id=${cid}&response_type=code&scope=${scope}&state=${token_state}&redirect_uri=${redirect_uri}`
  return URL
}

const Login = (props) => {
  const { dispatch }  = useContext(AuthContext)
  /** 
   * Not using state to hold loggedIn
   * const [loggedIn, setLoggedIn] = useState(false) 
  */
  const [errorMsg, setErrorMsg] = useState(null)

  /* immediately invoked when SP returns here after login*/
  useEffect(() => {
    console.log("inside useEffect")
    var [code, token_state] = getAuthCodeAndState(props.location.search)
    if (code && token_state) {
      getAuthToken(code, token_state)
    }
  }, []);

  const getAuthToken = (code, token_state) => {
    axios.get(`${process.env.REACT_APP_BACKEND_SERVICE_URL}/callback?code=${code}&state=${token_state}`).then(
      (response) => {
        if (response.statusText == "OK") {
          const jwt = response.data.jwt_access_token
          dispatch({
            type: "LOGIN",
            payload: jwt
          }) 
        }
        else {
          throw response 
        } 
      }).catch((err) => {
        setErrorMsg(`${err.statusText}: ${err.message}`)
      })
  }
  const URL = getSpotifyLoginRedirectUrl()

  return (
    <div>
      {isAuthenticated() ?
        <Redirect to={CREATE_PLAYLIST}/>
      : 
      <div className="loginContainer">
          <span className="text-box">
            <a className="loginLink" href={URL}>Click here to Login</a>
            <p>{errorMsg}</p>
          </span>
      </div>
      }
    </div>
  )
};

export default Login;
