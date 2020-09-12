import React from "react";
import { FormContext } from "./PlaylistForm";
import TextField from '@material-ui/core/TextField';
import InputNumber from 'rc-input-number';
import 'rc-input-number/assets/index.css';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';;

const SelectedSongCards = (props) => {
  const {songs, dispatch} = props

  const songList = songs.map((song, index) => 
    <li  style={{"list-style-type": "none"}}>
      <TextField disabled id="outlined-basic" variant="outlined"   
        defaultValue={[song.name, song.artists].join(', ')}
      />
      <InputNumber 
        min={0} max={10} step={1} 
        value={song.rank}
        style={{ width: 100 }}
        onChange={(newValue) => { 
          dispatch({
            type: "UPDATE_SONG_RANK",
            payload: {
              index: index,
              rank: newValue
            }
          })
        }}
      >
      </InputNumber>
      <CancelPresentationIcon fontSize="small" color="action"
        onClick={() => {
          dispatch({
            type: "REMOVE_BASE_SONG",
            payload: index,
          })
        }}
      />
    </li>
  )

  return (
    <ul>{songList}</ul>
  )

}

const SelectedSongs = () => {
  const { state, dispatch } = React.useContext(FormContext)

  return (
    <React.Fragment>
      <form>
        <label for="playlistName">Name</label>
        <input id="playlistName" style={{'width' : '50%'}}
        value={state.playlistName}
        onChange={(e) => dispatch({type: "UPDATE_PLAYLIST_NAME", payload: e.target.value})}
        />
      </form>
      <SelectedSongCards songs={state.baseSongs} dispatch={dispatch}/>
    </React.Fragment>
  )
}

export default SelectedSongs;