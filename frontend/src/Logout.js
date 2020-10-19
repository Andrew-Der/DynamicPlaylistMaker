import React from "react"
import { Link } from 'react-router-dom';
import { ABOUT_URL } from "./urls";

const Logout = () => {
  return (
    <>
      <div className="logoutContainer">
        <div className="container text-box">
            <p>
              Thanks for using my app!
              <br/>Hope you discover new songs and enjoy the playlist.
              <br/>If you want to donate, click here :)
            </p>
            <Link to={ABOUT_URL}>Back to the About Page!</Link>
        </div>
      </div>
    </>
  )
}
export default Logout