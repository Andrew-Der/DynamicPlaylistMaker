import React from "react"
import { Link } from 'react-router-dom';
import { LOGIN_URL } from "./urls"

const HomePage = () => {

  return (
    <>
      <div className="homePage">
        <div className="container text-box">
            <p>
              ABOUT PAGE
            </p>
            <Link to={LOGIN_URL}>Click to login</Link>
            <Link to={LOGIN_URL}>Click to login</Link>
        </div>
      </div>
    </>
  )
}
export default HomePage