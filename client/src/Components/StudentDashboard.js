import React from "react";
import "../StudentDashboard.css";
import logo from "../Images/AdviseLinkLogo.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const StudentDashboard = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const studentInfo = {
    name: "George Washington",
    id: "16j21114",
    major: "Software Engineering",
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
        <div className="logo">
          <img src={logo} alt="AdviseLink" />
        </div>
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
          <a href="#" className="nav-item">
            <i className="fas fa-folder"></i>
            Documents
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-chart-line"></i>
            GPA Improvement Plan
          </a>
        </nav>
      </div>

      <div className="main-content">
        <div className="student-profile">
          <div className="profile-info">
            <img
              src="/student-photo.jpg"
              alt="Student"
              className="profile-photo"
            />
            <div className="info">
              <h2>{studentInfo.name}</h2>
              <p>ID: {studentInfo.id}</p>
              <p>Major: {studentInfo.major}</p>
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
          <i className="fas fa-calendar-plus"></i>
          Book Meeting With Advisor
        </button>

        <div className="calendar-section">
          <div className="calendar-header">
            <button className="prev-month">
              <i className="fas fa-chevron-left"></i>
            </button>
            <h3>April 2025</h3>
            <button className="next-month">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          {/* Calendar grid would go here */}
        </div>

        <div className="semester-weeks">
          <h3>Semester Weeks</h3>
          <div className="weeks-progress">
            <div className="weeks-numbers">
              <span className="active">1</span>
              <span>2</span>
              <span className="active">3</span>
              <span className="active">4</span>
              <span>5</span>
              <span className="active">6</span>
            </div>
            <div className="progress-stats">
              <div className="finished">
                <span>9</span>
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
