import React from "react";
import {Link} from "react-router-dom";
const Nav =()=>{
    return(
        <ul className="App-header">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="api/user/login">Login</Link>
        </li>
        <li>
          <Link to="api/user/register">Register</Link>
        </li>
        <li>
          <Link to="api/user/dashboard">DashBoard</Link>
        </li>
        <li>
          <Link to="/api/test">Fetch data from backend</Link>
        </li>
        <li>
          <Link to="/api/user/logout">logout</Link>
        </li>

      </ul>
    )
}

export default Nav;