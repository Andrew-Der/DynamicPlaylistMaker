import React from "react";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FormContext } from "./PlaylistForm";
import TextField from '@material-ui/core/TextField';
import InputNumber from 'rc-input-number';
import 'rc-input-number/assets/index.css';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';;

const SelectedSongCards = (props) => {
  const {songs, dispatch} = props

  const songList = songs.map((song, index) => 
  <div className="baseSongListContainer">
    <li  style={{"list-style-type": "none"}}>
      <Container>
      <Row noGutters={true} >
      <Col xs={8}>
      <div className="songNameContainer">
        <p className="songNameText">{[song.name, song.artists].join(' by ')}</p>
      </div>
      </Col>
      <Col xs={2} className="songRankContainer">
      <InputNumber className="songRank"
        min={1} max={5} step={1} 
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
      </Col>
      <Col xs={2} className="songOptions">
        <CancelPresentationIcon fontSize="small" color="action"
        onClick={() => {
          dispatch({
            type: "REMOVE_BASE_SONG",
            payload: index,
          })
        }}
        />
      </Col>
      </Row>
      </Container>
    </li>
  </div>
  )
  return (
    <ul>{songList}</ul>
  )
}

const SelectedSongs = () => {
  const { state, dispatch } = React.useContext(FormContext)
  return (
    <div className="baseSongContainer">
      <SelectedSongCards songs={state.baseSongs} dispatch={dispatch}/>
    </div>
  )
}

export default SelectedSongs;