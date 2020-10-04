import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { ABOUT_URL, LOGOUT_URL, CREATE_PLAYLIST, LOGIN_URL} from "./urls";
import { useReducer } from "react"

import Header from "./Header";
import Logout from "./Logout";
import Login from "./Login";
import HomePage from "./HomePage";
import PlaylistForm from "./PlaylistForm/PlaylistForm";
import Cookies from 'js-cookie';

export const AuthContext = React.createContext()

const RequireAuth = ({loggedIn, children}) => {
  if (!loggedIn) {
    return <Redirect to={ABOUT_URL} />;
  }
  return children;
};

export const getJwtToken = () => Cookies.get('jwt_token')
export const isAuthenticated = () => !!getJwtToken()

const dummyInitialState = {
  loggedIn: true,
  jwtToken: "AndrewsToken",
}
const initialState = {
  loggedIn: false,           // browser has a JWT
  jwtToken : "",
}

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      const expires = (60 * 60) * 1000
      const inOneHour = new Date(new Date().getTime() + expires)
      Cookies.set('jwt_token', action.payload, { expires: inOneHour })
      return { ...state};
        // loggedIn: true, 
        // jwtToken: action.payload};
    case "LOGOUT":
      Cookies.remove('jwt_token')
      return { ...state}; 
        // loggedIn: false, 
        // jwtToken: "" };
    case "DATA_FETCH_FAILURE":
      return { ...state, loading: "", error: action.payload };
    case "DATA_FETCH_SUCCESS":
      return { ...state, loading: "", data: action.payload };
    default:
      return state;
  }
}

function AppRouter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
      <div>

      <AuthContext.Provider value={{state, dispatch}}>
        <Header/>
        <Switch>
        <Route exact path={'/'} component={HomePage}/>
        <Route exact path={ABOUT_URL} component={HomePage}/> 
        <Route exact path={LOGIN_URL} render={(props) => <Login {...props}/>}/>
        <Route exact path={LOGOUT_URL} component={Logout}/>
        <RequireAuth loggedIn={isAuthenticated()}>
          <Route exact path={CREATE_PLAYLIST} component={PlaylistForm} />
        </RequireAuth>
        </Switch>

      </AuthContext.Provider>
    </div>
  )
};

export default AppRouter;
