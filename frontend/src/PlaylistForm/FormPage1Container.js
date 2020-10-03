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
        <div className="container">
        <form className="singleHorizontalFormField">
            <label className="labelText" for="playlistName">Playlist Name</label>
            <input id="playlistName"
            value={state.playlistName}
            onChange={(e) => dispatch({type: "UPDATE_PLAYLIST_NAME", payload: e.target.value})}
            />
        </form>
        <div className="text-box container"> 
            <Collapse in={open}>
            <div id="example-collapse-text">
                Here does a descriptive description describing
                how to use this thing.
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
        <button onClick={()=>{dispatch({
            type: "UPDATE_FORM_PAGE",
            payload: 2
        })}}>Next</button>
        </div>
        </div>
    )
}

export default FormPage1Container;