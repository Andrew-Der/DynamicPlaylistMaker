import React from "react";
import { useReducer } from "react";
import FormPage1Container from "./FormPage1Container";
import FormPage2 from "./FormPage2";

export const FormContext = React.createContext()

const SP_SONG_NAME_INDEX = 0
const SP_ARTIST_INDEX = 1
const SP_POPULARITY_INDEX = 2
const SP_ALBUM_NAME = 3
const SP_SONG_ID_INDEX = 4

const exampleBaseSongs = [
    {id: "1h6Pww9RsC6gLMQA7zZop7",name: "Bad Guy",artists: "Billie", rank: 10},
    {id: "4AqN8IdKCfItCSbuaFch81",name: "Bad Guy",artists: "Billie", rank: 10},
    {id: "4U9kJBr61UhO5srPib7zyz",name: "Bad Guy",artists: "Billie", rank: 8},
    {id: "6RKFXPdoCBRcLljsxKZUNw",name: "Bad Guy",artists: "Billie", rank: 9},
    {id: "4Oxoa9kJmuFGTYvwGFfyY9",name: "Bad Guy",artists: "Billie", rank: 8},
    {id: "21UoRIOIjkWdHU8xbxQ0Z7",name: "Bad Guy",artists: "Billie", rank: 9},
    {id: "0sf12qNH5qcw8qpgymFOqD",name: "Bad Guy",artists: "Billie", rank: 8},
    {id: "5vBRXormXITLRQBZAl0Jbx",name: "Bad Guy",artists: "Billie", rank: 9},
]

const initialState = {
    baseSongs : [],            // [{SID, name, artists, rank}, {}]
    // baseSongs: exampleBaseSongs,
    playlistName : "Super Awesome Machine Learning Playlist...",         // Super Awesome ML Playlist
    playlistTraits : ["","",""],       // ['energy', 'danceability'] 3 max
    playlistTempo : 0,         // -1=decreasing, 0=none, 1=increasing
    playlistDuration : -1,     // minutes
    includeBaseSongs : true,
    formError : "",
    currentPageNumber : 1,
    minRatingAcceptanceForNewSongs: 8,
    numberOfNewSongsToAdd: "",
    isFetching : false,
    hasError : "",
    createPlaylistSuccess : false,
    createPlaylistLink : "",
}

const minSongsAndRankIsValid = (state) => {

    if (state.baseSongs.length < 6) {
        return false
    }
    const ranks = state.baseSongs.map((item) => {return item.rank}) 
    const rankMap = {}
    for (var i = 0; i < ranks.length; i++) {
        if (ranks[i] in rankMap) {
            rankMap[`${ranks[i]}`]++
        }
        else {
            rankMap[`${ranks[i]}`] = 1
        }
    }
    for (var rank in rankMap) {
        if (rankMap[`${rank}`] == 1) {
            return false
        }
    }
    return true
}

const reorderSongsInDescendingRank = (songList) => {

    // reOrder the song list
    // itr through the list and have a len 10 array of arrays
    // and append the songs through

    // finally go through from 10 -> 1 and put songs in
    return []
}

const reducer = (state, action) => {
    switch (action.type) {
        case "UPDATE_PLAYLIST_NAME":
            return { ...state,
            playlistName: action.payload};
        case "ADD_BASE_SONG":
            const newSong = {
                id: action.payload[SP_SONG_ID_INDEX],
                name: action.payload[SP_SONG_NAME_INDEX],
                artists: action.payload[SP_ARTIST_INDEX].join(', '),
                rank: 8
            }
            return { ...state, 
            baseSongs: [...state.baseSongs, newSong]};
        case "REMOVE_BASE_SONG":
            state.baseSongs.splice(action.payload, 1);
            return { ...state,
            baseSongs: state.baseSongs};
        case "UPDATE_SONG_RANK":
            state.baseSongs[action.payload.index].rank = action.payload.rank
            return { ...state, 
            baseSongs: state.baseSongs,
            };
        case "UPDATE_DURATION":
            return { ...state, playlistDuration: action.payload };
        case "UPDATE_TEMPO":
            return { ...state, playlistTempo: action.payload };
        case "UPDATE_FORM_PAGE":
            // 1-> 2 or 2 -> 1
            if (action.payload == 2 && !minSongsAndRankIsValid(state)) {
                return {...state, formError: "Select at least 6 Songs, with right rankings."} 
            }
            else {
                return { ...state, currentPageNumber: action.payload, formError: "" };
            }
        case "UPDATE_INCLUDE_BASE_SONGS":
            return { ...state, includeBaseSongs: action.payload };
        case "UPDATE_TRAIT":
            state.playlistTraits[action.payload.index] = action.payload.trait
            return { ...state, includeBaseSongs: state.playlistTraits };
        case "UPDATE_MIN_RATING_ACCEPTANCE_FOR_NEW_SONGS":
            return {...state,
            minRatingAcceptanceForNewSongs: action.payload,
            };
        case "UPDATE_NUMBER_OF_NEW_SONGS":
            return {...state,
            numberOfNewSongsToAdd: action.payload,
            };
        case "CREATE_PLAYLIST_FETCH":
            return { ...state, isFetching: true };
        case "CREATE_PLAYLIST_SUCCESS":
            console.log("SUCCUES " + action.payload)
            return { ...state, isFetching: false , createPlaylistSuccess: true,
            createPlaylistLink: action.payload};
        case "CREATE_PLAYLIST_ERROR":
            return { ...state, isFetching: false, hasError: action.payload };
        case "REORDER_BASE_SONGS_IN_DESCENDING_RANK":
            const newOrder = reorderSongsInDescendingRank(state.baseSongs)
            return { ...state,
            baseSongs: newOrder
        }
        default:
            return state;
    }
  }

const PlaylistForm = () => {

    const [state, dispatch] = useReducer(reducer, initialState)
    const formPages = [<FormPage1Container/>, <FormPage2/>]

    return (
        <FormContext.Provider value={{state, dispatch}}>
            {formPages[state.currentPageNumber - 1]}
            <div>
                {state.formError}
            </div>
        </FormContext.Provider>
    )
  }

export default PlaylistForm