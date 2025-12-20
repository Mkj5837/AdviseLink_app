import React, { useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "../../css/Dashboard.css";
import WelcomeCard from "./WelcomeCard";
import RequestsSection from "./Requests";
import AdviseesList from "./AdviseeList";
import logo from "../../Images/AdviseLinkLogo.png";
import stud1 from "../../Images/studImge.jpg";
import { logout } from "../../Features/userSlice";
import { persistor } from "../../store/store";

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      await persistor.purge();
    } catch (e) {
      console.warn("Logout encountered an error, proceeding to login.", e);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        {/* sidebar end. */}
        {/* <a href="#" className="nav-item">
            <i className="fas fa-search"></i>
            Search Academic Plan
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-user-search"></i>
            Search Advisee
          </a> */}
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item active">
            <i className="fas fa-home"></i>
            Dashboard
          </Link>
          <Link to="/advisees" className="nav-item">
            <i className="fas fa-user-friends"></i>
            Advisees
          </Link>
          <Link to="/tasks" className="nav-item">
            <i className="fas fa-tasks"></i>
            Tasks
          </Link>
          <Link to="/meetings" className="nav-item">
            <i className="fas fa-calendar"></i>
            Meeting Requests
          </Link>
          <Link to="/about" className="nav-item">
            <i className="fas fa-info-circle"></i>
            About
          </Link>
          <button type="button" className="nav-item" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </nav>
      </div>

      <div className="main-content">
        {/* <header className="dashboard-header">
          <h1>Dashboard</h1>
        </header> */}

        <div className="dashboard-grid">
          <WelcomeCard />
          <div className="stats-cards">
            <div className="stat-card">
              <h3>Advisees</h3>
              <span className="stat-number">15</span>
            </div>
            <div className="stat-card">
              <h3>Signed</h3>
              <span className="stat-number">12</span>
            </div>
            <div className="stat-card">
              <h3>Remain</h3>
              <span className="stat-number">3</span>
            </div>
          </div>

          <div className="dashboard-sections">
            <RequestsSection />
            <AdviseesList />
          </div>
        </div>

        {/* Outlet for nested dashboard child routes (e.g. /dashboard/profile) */}
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
