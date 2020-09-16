import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { CREATE_PLAYLIST } from "./urls";
import axios from 'axios';
import { useState, useContext } from "react";
import { AuthContext } from "./router";

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

const Login = (props) => {
  const {state, dispatch}  = useContext(AuthContext)
  const [loggedIn, setLoggedIn] = useState(false)
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
        console.log(response)
        if (response.statusText == "OK") {
          const jwt = response.data.jwt_access_token
          dispatch({
            type: "LOGIN",
            payload: jwt
          }) 
          console.log("LOGIN page setting true")
          setLoggedIn(true)
        }
        else {
          throw response 
        } 
      }).catch((err) => {
        setErrorMsg(`${err.statusText}: ${err.message}`)
      })
  }

  const API_URL = 'https://accounts.spotify.com/authorize'
  const redirect_uri = `http://${process.env.REACT_APP_SPOTIFY_REDIRECT_TO_CLIENT_HOSTNAME}/login` 
  const token_state = generateRandomString(16)
  const scope = "playlist-modify-public playlist-read-private"
  const URL = API_URL + `?client_id=${cid}&response_type=code&scope=${scope}&state=${token_state}&redirect_uri=${redirect_uri}`

  return (
    <div>
      {loggedIn ?
      <Redirect to={CREATE_PLAYLIST}/>
      : 
      <span>
        <a href={URL}>Login to access Dashboard</a>
        <p>{errorMsg}</p>
      </span>
      }
    </div>
  )
};

export default Login;
