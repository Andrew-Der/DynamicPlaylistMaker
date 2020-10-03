import React from "react"
import { Link } from 'react-router-dom';

const Homepage = () => {


  return (
    <>
      <div className="logout">
        <div className="container text-box">
            <p>
              Logout Page: Thanks for using my app!
            </p>
            <Link to="/home">Click to re-login</Link>
        </div>
      </div>
    </>
  )
}
export default Homepage