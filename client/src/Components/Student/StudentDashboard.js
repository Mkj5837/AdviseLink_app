import React from "react";
import "../../css/StudentDashboard.css";
import logo from "../../Images/AdviseLinkLogo.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { use } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { userimg } from "../../Images/blank-pfp.png";

const StudentDashboard = () => {
  const currentUser = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const studentInfo = {
    name: currentUser
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : "Student Name",
    id: currentUser ? currentUser.idNumber : "123456789",
    avatar: currentUser ? currentUser.profilePic : "/blank-pfp.png",
  };

  const tasks = [
    { name: "Full-Stack Project", weight: "16.06", deadline: "20:00" },
    {
      name: "Applied Machine Learning Project",
      weight: "17.06",
      deadline: "20:00",
    },
    {
      name: "Fundamental of Big Data Assignment",
      weight: "18.06",
      deadline: "19:30",
    },
    {
      name: "Fundamentals of Digital Marketing Quiz",
      weight: "20.06",
      deadline: "14:00",
    },
    {
      name: "Fundamental of Big Data Practical Quiz",
      weight: "21.06",
      deadline: "16:30",
    },
    { name: "Workshop", weight: "24.06", deadline: "17:30" },
  ];

  return (
    <div className="student-dashboard">
      <div className="sidebar">
        <nav className="nav-menu">
          <a href="#" className="nav-item active">
            <i className="fas fa-home"></i>
            Dashboard
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-calendar"></i>
            Next Advisor Meeting
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-file-alt"></i>
            My Academic Plan
          </a>
          <a href="/" className="nav-item">
            <i className="fas fa-info-circle"></i>
            About
          </a>
          {/* <a href="#" className="nav-item">
            <i className="fas fa-chart-line"></i>
            GPA Improvement Plan
          </a> */}
        </nav>
      </div>

      <div className="main-content">
        <div className="student-profile">
          <div className="profile-info">
            <img
              src={studentInfo.avatar}
              alt="Student"
              className="profile-photo"
            />
            <div className="info">
              <h2>{studentInfo.name}</h2>
              <p>ID: {studentInfo.id}</p>
            </div>
          </div>
          <button className="gpa-plan-btn">AI GPA improvement plan</button>
        </div>

        <div className="tasks-section">
          <h3>Academic Tasks For GPA Improvement</h3>
          <div className="tasks-table">
            <div className="table-header">
              <span>List of Tasks</span>
              <span>Weight</span>
              <span>Deadline</span>
            </div>
            {tasks.map((task, index) => (
              <div key={index} className="task-row">
                <span>{task.name}</span>
                <span>{task.weight}</span>
                <span>{task.deadline}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="book-meeting-btn">
          <i className="fas fa-info-circle"></i>
          Book Meeting With Advisor
        </button>

        <div className="semester-weeks">
          <h3>Semester Weeks</h3>
          <div className="weeks-progress">
            <div className="progress-stats">
              <div className="finished">
                <span>8</span>
                <p>Finished</p>
              </div>
              <div className="remaining">
                <span>1</span>
                <p>Remaining</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
