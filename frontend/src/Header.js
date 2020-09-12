import React from "react";
import { useState, useContext } from "react";
import { AuthContext } from "./router"

const Header = () => {
  const {state, dispatch} = useContext(AuthContext)
  return (
    <nav id="navigation">
      <h1 href="#" className="logo">
        HOOKED
      </h1>
    </nav>
  );
};
export default Header;