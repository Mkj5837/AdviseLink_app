import React from "react";
import { NavLink } from "react-router-dom";
import "../../css/SideBar.css";

const StudentSideBar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2 style={{ color: "#007bff" }}>AdviseLink</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/student-dashboard"
              className={({ isActive }) =>
                isActive ? "active-link" : "nav-link"
              }
            >
              My Roadmap
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/book-meeting"
              className={({ isActive }) =>
                isActive ? "active-link" : "nav-link"
              }
            >
              Book Meeting
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/meetings"
              className={({ isActive }) =>
                isActive ? "active-link" : "nav-link"
              }
            >
              My Meetings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "active-link" : "nav-link"
              }
            >
              My Profile
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "active-link" : "nav-link"
              }
            >
              About
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default StudentSideBar;
