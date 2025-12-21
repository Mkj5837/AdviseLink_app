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
      const advisorIdentifier = (
        user.idNumber ||
        user.email ||
        user._id ||
        ""
      ).toString();
      const advisorObjectId = user._id?.toString();
      if (!advisorIdentifier) return;

      // Fetch actual advisees for this advisor
      const adviseeRes = await api.get(`/myAdvisees/${advisorIdentifier}`);
      setAdviseeCount(Array.isArray(adviseeRes.data) ? adviseeRes.data.length : 0);

      // Fetching scheduled meetings count
      if (advisorObjectId) {
        const meetingRes = await api.get(
          `/meetings?advisorId=${advisorObjectId}&status=scheduled`
        );
        setMeetingCount(meetingRes.data.length);
      } else {
        setMeetingCount(0);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
      setAdviseeCount(0);
      setMeetingCount(0);
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

          {/* 3. Advisee list */}
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
