import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../css/Dashboard.css";
import WelcomeCard from "./WelcomeCard";
import RequestsSection from "./Requests";
import AdviseesList from "./AdviseeList";
import logo from "../../Images/AdviseLinkLogo.png";
import stud1 from "../../Images/studImge.jpg";

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  console.log("Current user:", user);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        {/* sidebar end. */}
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <i className="fas fa-home"></i>
            Dashboard
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-calendar"></i>
            Meeting Requests
          </a>
          {/* <a href="#" className="nav-item">
            <i className="fas fa-search"></i>
            Search Academic Plan
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-user-search"></i>
            Search Advisee
          </a> */}
          <a href="#" className="nav-item">
            <i className="fas fa-chart-bar"></i>
            Advisee List
          </a>
          <a href="/about " className="nav-item">
            <i className="fas fa-info-circle"></i>
            About
          </a>
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
      </div>
    </div>
  );
};

export default Dashboard;
