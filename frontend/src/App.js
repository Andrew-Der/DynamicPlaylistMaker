import React from 'react';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router";
import { Helmet } from "react-helmet";

function App() {
  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Dynamic Playlist Maker</title>
      </Helmet>
      <Router>
        <AppRouter />
      </Router>
    </div>
  );
}

export default App;
