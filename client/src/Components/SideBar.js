import React from "react";
import { Link } from "react-router-dom";
import "./SideBar.css"; // Make sure to create this CSS file for styling

const SideBar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        {/* You can put your logo here */}
        <h2>AdviseLink</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;