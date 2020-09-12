import React from "react";
import { useReducer } from "react";
import { AuthContext } from "./../router";
import { FormContext } from "./PlaylistForm";
import { perform } from "./../apiClient";
import SearchBar from "material-ui-search-bar";

const initialState = {
  query: "",
  fetchedSongs: [],   // [[str:name, [str]:artists, int:popular, str:album, int:id], []]
  isFetching: false,
  hasError: false,
}

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SONGS_REQUEST":
      return {
        ...state,
        isFetching: true,
        hasError: false,
      }
    case "FETCH_SONGS_SUCCESS":
      return {
        ...state,
        isFetching: false,
        hasError: false,
        fetchedSongs: action.payload,
      }
    case "FETCH_SONGS_ERROR":
      return {
        ...state,
        isFetching: false,
        hasError: true,
      }
    case "QUERY_UPDATE":
      return {
        ...state,
        query: action.payload
      }
    default:
    return state;
  }
}

const SongCards = (props) => {
  const { dispatch, songs } = props
  const listItems = songs.map((song) => 
    <li onClick={() => {
      dispatch({
        type: "ADD_BASE_SONG",
        payload: song,
      })
    }} key={song[4]}>
      {song[0]}, {song[1].join(', ')} , {song[3]}
    </li>  
  )
  return (
    <ol>{listItems}</ol>
  )
}

export const SongSearchBar = () => {

  const [state, dispatch] = useReducer(reducer, initialState)
  const { state: formState, dispatch: formDispatch } = React.useContext(FormContext)
  const { state: authState, dispatch: authDispatch } = React.useContext(AuthContext)
  const fetchSongs = async () => {
    dispatch({type: "FETCH_SONGS_REQUEST"})
    const retSongs = await perform('post', '/fetch_songs', {'track_query' : state.query}, authState.jwtToken)
    
    if (Array.isArray(retSongs)) {
      console.log(retSongs)
      dispatch({
        type: "FETCH_SONGS_SUCCESS",
        payload: retSongs,
      })
    }
    else {
      dispatch({
        type: "FETCH_SONGS_ERROR",
      })
    }
  }

  return (
    <div>
      <div>
      <SearchBar placeHolder="Blinding Lights"
        value={state.query}
        onChange={(newValue) => dispatch({type: "QUERY_UPDATE", payload: newValue})}
        onRequestSearch={() => fetchSongs()}
      />
      </div>
      <div>
        <SongCards dispatch={formDispatch} songs={state.fetchedSongs}/>
      </div>
    </div>
  );
};
export default SongSearchBar;