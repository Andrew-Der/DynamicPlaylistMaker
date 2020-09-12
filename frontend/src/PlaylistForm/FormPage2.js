import React from "react";
import { FormContext } from "./PlaylistForm";
import { AuthContext } from "./../router";
import { perform } from './../apiClient';

const submitForm = async(state, dispatch, token) => {

    dispatch({type: "CREATE_PLAYLIST_FETCH"})
    const ret = await perform('post', '/create_playlist', 
    {
        'playlist_name' : state.playlistName,
        'base_songs': state.baseSongs,
    }, 
    token)
    
    if (ret.constructor == Object && 'href' in ret) {
      dispatch({
        type: "CREATE_PLAYLIST_SUCCESS",
        payload: ret.href,
      })
    }
    else {
      dispatch({
        type: "CREATE_PLAYLIST_ERROR",
        payload: ret,
      })
    }
 }

const FormPage2 = () => {

    const { state: formState, dispatch: formDispatch } = React.useContext(FormContext)
    const { state: authState, dispatch: authDispatch } = React.useContext(AuthContext)
    return (
        <div>
        <button onClick={()=>{formDispatch({
            type: "UPDATE_FORM_PAGE",
            payload: 1
        })}}>Previous</button>
        <button onClick={() => submitForm(formState, formDispatch, authState.jwtToken)}>
            Create Playlist!</button>
        {formState.createPlaylistSuccess?
            <a href={formState.createPlaylistLink}>{formState.createPlaylistLink}</a>:
            ""
        }
        </div>
    )
}

export default FormPage2;