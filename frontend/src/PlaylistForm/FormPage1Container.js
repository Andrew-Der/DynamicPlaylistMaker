import React from "react";
import { FormContext } from "./PlaylistForm";
import SongSearchBar from "./SongSearchBar";
import SelectedSongs from "./SelectedSongs";

const FormPage1Container = () => {

    const { state, dispatch } = React.useContext(FormContext)
    return (
        <span>
        <form>
            <label for="playlistName">Playlist Name</label>
            <input id="playlistName" style={{'width' : '50%'}}
            value={state.playlistName}
            onChange={(e) => dispatch({type: "UPDATE_PLAYLIST_NAME", payload: e.target.value})}
            />
        </form>
        <SongSearchBar/>
        <SelectedSongs/>
        <button onClick={()=>{dispatch({
            type: "UPDATE_FORM_PAGE",
            payload: 2
        })}}>Next</button>
        </span>
    )
}

export default FormPage1Container;