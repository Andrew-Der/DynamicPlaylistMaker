import React from "react"
import { Link } from 'react-router-dom';
import { ABOUT_URL } from "./urls";

const Logout = () => {
  return (
    <>
      <div className="logout">
        <div className="container text-box">
            <p>
              Logout Page: Thanks for using my app!
            </p>
            <Link to={ABOUT_URL}>Click to visit About Page</Link>
        </div>
      </div>
    </>
  )
}
export default Logout