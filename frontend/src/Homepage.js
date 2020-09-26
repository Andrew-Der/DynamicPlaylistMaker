import React from "react"
import { Link } from 'react-router-dom';

const Homepage = () =>
    <div>
        <header className="App-header">
          <p>
            Logout Page: Thanks for using my app!
          </p>
          <Link to="/home">Click to re-login</Link>
        </header>
    </div>

export default Homepage