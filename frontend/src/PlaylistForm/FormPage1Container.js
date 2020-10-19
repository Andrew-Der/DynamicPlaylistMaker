import React from "react";
import { useState } from "react";
import Collapse from 'react-bootstrap/Collapse';
import { FormContext } from "./PlaylistForm";
import SongSearchBar from "./SongSearchBar";
import SelectedSongs from "./SelectedSongs";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const FormPage1Container = () => {

    const [open, setOpen] = useState(true)
    const { state, dispatch } = React.useContext(FormContext)
    return (
        <div className="formPage1">
            <div className="container formPage1Content">
                <form className="singleHorizontalFormField">
                    <label className="labelText" for="playlistName">Your New Playlist Name</label>
                    <input id="playlistName"
                    value={state.playlistName}
                    onChange={(e) => dispatch({type: "UPDATE_PLAYLIST_NAME", payload: e.target.value})}
                    />
                </form>
                <div className="text-box container"> 
                    <Collapse in={open}>
                    <div id="example-collapse-text">
                    Let’s create a playlist with a purpose, what kind of vibes are you feeling?
                    <br/>Then, use the search bar to find songs and select them into the playlist. 
                    After adding all the songs, give each track an individual rating from 1-5 where…
                    <br/>1 = The song is good but don’t need to hear more like it
                    <br/>3 = Great song and would like to hear more like it
                    <br/>5 = Love the track and really want to hear more like it
                    <br/><br/>
                    The small catch here, there must be at least two of each number rating and at least 6 songs. 
                    <br/>Happy Playlisting!
                    </div>
                    </Collapse>
                    <div>
                    <span
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                    >
                        {open?<KeyboardArrowUpIcon/>:<KeyboardArrowDownIcon/>}
                    </span>
                    </div>
                </div>
                <SongSearchBar/>
                <SelectedSongs/>
                <div>
                    {state.formError}
                </div>
            </div>
            <button onClick={()=>{dispatch({
                    type: "UPDATE_FORM_PAGE",
                    payload: 2
                })}}>Next</button>
        </div>
    )
}

export default FormPage1Container;