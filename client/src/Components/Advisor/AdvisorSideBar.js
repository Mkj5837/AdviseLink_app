import React from "react";
import { NavLink } from "react-router-dom";
import "../../css/SideBar.css";

const AdvisorSideBar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2 style={{ color: "#007bff" }}>AdviseLink</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "active-link" : "nav-link"
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/userlist"
              className={({ isActive }) =>
                isActive ? "active-link" : "nav-link"
              }
            >
              Add Advisee
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/add-task"
              className={({ isActive }) =>
                isActive ? "active-link" : "nav-link"
              }
            >
              Add Task
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/meetings"
              className={({ isActive }) =>
                isActive ? "active-link" : "nav-link"
              }
            >
              Meetings
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

export default AdvisorSideBar;
