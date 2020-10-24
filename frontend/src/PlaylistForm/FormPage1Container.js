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
                <div className="text-box container"> 
                    Create a Spotify playlist from best recommendations of songs you choose.
                    First, give the playlist a name. It works best when the playlist has a theme, what kind of vibes are you feeling?
                </div>
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
                    Then, use the search bar to find songs and select them into the playlist. 
                    After adding the songs, rate each song individually according to playlist relevance where:
                    <br/><br/>1 = The song is good but just here for the sake of harmony
                    <br/>3 = Great song and would like to hear more like it, it moderately characterizes this playlist
                    <br/>5 = Love the song and really want to hear more like it, it strongly characterizes this playlist
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
                        {open?
                            <div><KeyboardArrowUpIcon style={{"margin-bottom": "-7%"}}/><br/><KeyboardArrowUpIcon/></div>
                        :<KeyboardArrowDownIcon/>}
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