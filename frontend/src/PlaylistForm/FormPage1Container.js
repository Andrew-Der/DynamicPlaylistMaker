import React from "react";
import { useState } from "react";
import { FormContext } from "./PlaylistForm";
import SongSearchBar from "./SongSearchBar";
import SelectedSongs from "./SelectedSongs";

const FormPage1Container = () => {

    const [error, setError] = useState("")
    const { dispatch } = React.useContext(FormContext)

    return (
        //col 1 = songFetch, col 2 = baseSongs
        <span>
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