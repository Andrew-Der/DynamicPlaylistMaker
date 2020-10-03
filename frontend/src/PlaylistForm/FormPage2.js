import React from "react";
import { FormContext } from "./PlaylistForm";
import { AuthContext } from "./../router";
import { perform } from './../apiClient';
import InputNumber from 'rc-input-number';

const submitForm = async(state, dispatch, token, return_count_only=false) => {

    dispatch({type: "CREATE_PLAYLIST_FETCH"})
    const ret = await perform('post', '/create_playlist', 
    {
        'playlist_name' : state.playlistName,
        'base_songs': state.baseSongs,
        'min_rating_acceptance': state.minRatingAcceptanceForNewSongs,
        'return_count_only': return_count_only,
    }, 
    token)

    /* Handle only getting the count */
    if (return_count_only) {
      if (ret.constructor == Object && 'number_of_new_songs' in ret) {
        dispatch({
          type: "UPDATE_NUMBER_OF_NEW_SONGS",
          payload: ret.number_of_new_songs,
        }) 
      }
    }
    /* Handle returning the new playlist link */
    else {
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
 }

const FormPage2 = () => {

    const { state: formState, dispatch: formDispatch } = React.useContext(FormContext)
    const { state: authState, dispatch: authDispatch } = React.useContext(AuthContext)
    return (
        <div className="pageDos">
          <div className="pageDosContent">
            <div className="text-box container">
            <span> Here you can change the Min Rating Acceptance which
              does the following to allow more or less songs and I'm
              just typing away to fill this description.
            </span>
            </div>
            <span className="formField">
              <h4 className="minRatingText">Min Rating Acceptance</h4>
              <InputNumber 
                min={0} max={10} step={1} 
                value={formState.minRatingAcceptanceForNewSongs}
                style={{ width: 100 }}
                onChange={(newValue) => { 
                  formDispatch({
                    type: "UPDATE_MIN_RATING_ACCEPTANCE_FOR_NEW_SONGS",
                    payload: newValue
                  })
                }}
              >
              </InputNumber>
            </span>
            <div>
              {formState.numberOfNewSongsToAdd}
              <div className="textButtonContainer" 
                onClick={() => submitForm(formState, formDispatch, authState.jwtToken, true)}>
                <h4>Calculate the number of new songs</h4>
              </div>
              <div className="textButtonContainer" 
                onClick={() => submitForm(formState, formDispatch, authState.jwtToken)}>
                <h4>Create Playlist!</h4>
              </div>
            </div>
            <div>
              {formState.createPlaylistSuccess?
                  <a href={formState.createPlaylistLink}>{formState.createPlaylistLink}</a>:
                  ""
              }
            </div>
          
          </div>
          <button onClick={()=>{formDispatch({
                  type: "UPDATE_FORM_PAGE",
                  payload: 1
          })}}>Previous</button>
        </div>
    )
}

export default FormPage2;