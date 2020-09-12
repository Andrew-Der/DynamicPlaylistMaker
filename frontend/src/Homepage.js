import React from "react"

import logo from './logo.svg';
import axios from 'axios'
import { Link } from 'react-router-dom';


const Homepage = () =>
    <div>
        <header className="App-header">
          <Link to="/login">Click to login</Link>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
    </div>

export default Homepage