import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../css/Dashboard.css";
import WelcomeCard from "./WelcomeCard";
import AdviseesList from "./AdviseeList";
import api from "../../api/axios";

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  // States for real data counts
  const [adviseeCount, setAdviseeCount] = useState(0);
  const [meetingCount, setMeetingCount] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchDashboardStats();
    }
  }, [user, navigate]);

  const fetchDashboardStats = async () => {
    try {
      // Fetching advisees count
      const adviseeRes = await api.get("/advisors");
      setAdviseeCount(adviseeRes.data.length);

      // Fetching scheduled meetings count
      const meetingRes = await api.get(
        `/meetings?advisorId=${user.idNumber}&status=scheduled`
      );
      setMeetingCount(meetingRes.data.length);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <div className="dashboard-grid">
          {/* 1. Welcome Card (Updated internally for name) */}
          <WelcomeCard />

          {/* 2. Simplified Stats: Only 2 Cards */}
          <div className="stats-cards-two-column">
            <div className="stat-card">
              <h3>Total Students</h3>
              <span className="stat-number">{adviseeCount}</span>
            </div>
            <div className="stat-card">
              <h3>Scheduled Meetings</h3>
              <span className="stat-number">{meetingCount}</span>
            </div>
          </div>

          {/* 3. Removed RequestsSection, Keeping AdviseesList (Static list on right) */}
          <div className="dashboard-sections-simple">
            <AdviseesList />
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
