import React, { useEffect, useState } from "react";
import "../../css/StudentDashboard.css";
import logo from "../../Images/AdviseLinkLogo.png";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { postCheckIn } from "../../api/checkin";
import { fetchTasks, updateTaskStatus } from "../../Features/taskSlice";

const StudentDashboard = () => {
  const currentUser = useSelector((state) => state.user.user);
  const {
    items: tasks = [],
    loading: tasksLoading,
    error: tasksError,
    metrics = {},
  } = useSelector((state) => state.tasks || {});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [checkinStatus, setCheckinStatus] = useState("");
  const [checkinLoading, setCheckinLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }
    if (currentUser?._id) {
      dispatch(fetchTasks(currentUser._id));
    }
  }, [currentUser, navigate, dispatch]);

  const studentInfo = {
    name: currentUser
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : "Student Name",
    id: currentUser ? currentUser.idNumber : "123456789",
    avatar: currentUser ? currentUser.profilePic : "/blank-pfp.png",
  };

  const completedCount =
    metrics.completedCount ?? tasks.filter((t) => t.isCompleted).length;
  const totalCount = metrics.totalCount ?? tasks.length;
  const progress =
    metrics.currentProgress ??
    (totalCount ? Math.round((completedCount / totalCount) * 100) : 0);

  const formatDeadline = (date) => {
    if (!date) return "—";
    try {
      return new Date(date).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (err) {
      return date;
    }
  };

  const handleToggleComplete = (task) => {
    if (!task?._id || !currentUser?._id) {
      return;
    }
    dispatch(
      updateTaskStatus({
        taskId: task._id,
        studentId: currentUser._id,
        isCompleted: !task.isCompleted,
      })
    );
  };

  const handleCheckIn = () => {
    if (!currentUser) {
      setCheckinStatus("Please log in to check in.");
      return;
    }

    if (!navigator?.geolocation) {
      setCheckinStatus("Geolocation is not supported in this browser.");
      return;
    }

    setCheckinLoading(true);
    setCheckinStatus("Requesting location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const payload = {
            studentId: currentUser.idNumber || currentUser.email,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toISOString(),
          };
          const res = await postCheckIn(payload);
          setCheckinStatus(res.data?.message || "Check-in successful.");
        } catch (error) {
          const msg =
            error.response?.data?.error ||
            error.message ||
            "Failed to record check-in.";
          setCheckinStatus(msg);
        } finally {
          setCheckinLoading(false);
        }
      },
      (error) => {
        setCheckinLoading(false);
        setCheckinStatus(
          error.message || "Could not get your location. Please try again."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="student-dashboard">
      <div className="sidebar">
        <nav className="nav-menu">
          <Link to="/student-dashboard" className="nav-item active">
            <i className="fas fa-home"></i>
            Dashboard
          </Link>
          <Link to="/add-task" className="nav-item">
            <i className="fas fa-plus-circle"></i>
            Add Task
          </Link>
          <Link to="/meetings" className="nav-item">
            <i className="fas fa-calendar-alt"></i>
            Meeting List
          </Link>
          <Link to="/about" className="nav-item">
            <i className="fas fa-info-circle"></i>
            About
          </Link>
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
          <Link to="/student-dashboard" className="gpa-plan-btn">
            AI GPA improvement plan
          </Link>
        </div>

        <div className="tasks-section">
          <h3>Academic Tasks For GPA Improvement</h3>
          <div className="tasks-meta">
            <span>
              Completed: {completedCount}/{totalCount || 0}
            </span>
            <span>Progress: {progress}%</span>
            {tasksError && <span className="task-error">{tasksError}</span>}
          </div>
          <div className="tasks-table">
            <div className="table-header">
              <span>List of Tasks</span>
              <span>Weight</span>
              <span>Deadline</span>
              <span>Status</span>
            </div>
            {tasksLoading ? (
              <div className="task-row">
                <span>Loading tasks...</span>
                <span>—</span>
                <span>—</span>
                <span>—</span>
              </div>
            ) : tasks.length === 0 ? (
              <div className="task-row">
                <span>No tasks yet.</span>
                <span>—</span>
                <span>—</span>
                <span>—</span>
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task._id} className="task-row">
                  <span>{task.title}</span>
                  <span>{task.weight ?? "—"}</span>
                  <span>{formatDeadline(task.deadline)}</span>
                  <span className="task-status">
                    <span
                      className={
                        task.isCompleted ? "status-badge done" : "status-badge pending"
                      }
                    >
                      {task.isCompleted ? "Completed" : "Pending"}
                    </span>
                    <button
                      type="button"
                      className="task-toggle"
                      onClick={() => handleToggleComplete(task)}
                      disabled={tasksLoading}
                    >
                      {task.isCompleted ? "Mark Incomplete" : "Mark Complete"}
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <Link to="/book-meeting" className="book-meeting-btn">
          <i className="fas fa-info-circle"></i>
          Book Meeting With Advisor
        </Link>

        <div className="checkin-card">
          <div>
            <h3>Campus Check-in</h3>
            <p className="checkin-subtext">
              Share your current location to confirm you are on campus.
            </p>
          </div>
          <div className="checkin-actions">
            <button
              type="button"
              className="register-button"
              onClick={handleCheckIn}
              disabled={checkinLoading}
            >
              {checkinLoading ? "Checking in..." : "Check in now"}
            </button>
            {checkinStatus && (
              <span className="checkin-status">{checkinStatus}</span>
            )}
          </div>
        </div>

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
