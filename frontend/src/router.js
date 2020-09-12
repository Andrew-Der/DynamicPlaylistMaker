import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { HOME_URL, LOGIN_URL, CREATE_PLAYLIST} from "./urls";
import { useReducer } from "react"

import Header from "./Header";
import Homepage from "./Homepage";
import Login from "./Login";
import PlaylistForm from "./PlaylistForm/PlaylistForm";

export const AuthContext = React.createContext()

const RequireAuth = ({loggedIn, children}) => {
  if (!loggedIn) {
    return <Redirect to={LOGIN_URL} />;
  }
  return children;
};

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
      console.log("inside reducer LOGIN")
      return { ...state, 
        loggedIn: true, 
        jwtToken: action.payload};
    case "LOGOUT":
      return { ...state, 
        loggedIn: false, 
        jwtToken: "" };
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
        <Route exact path={'/'} component={Homepage} />
        <Route exact path={HOME_URL} component={Homepage} />

        <Route exact path={LOGIN_URL} render={(props) => <Login {...props}/>}/>
        <RequireAuth loggedIn={state.loggedIn}>
          <Route exact path={CREATE_PLAYLIST} component={PlaylistForm} />
        </RequireAuth>
        </Switch>

      </AuthContext.Provider>
    </div>
  )
};

export default AppRouter;
