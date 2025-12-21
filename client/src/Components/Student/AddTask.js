import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createTask } from "../../Features/taskSlice";
import "../../css/StudentDashboard.css";

const AddTask = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user);
  const { loading } = useSelector((state) => state.tasks || {});

  const [title, setTitle] = useState("");
  const [weight, setWeight] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !weight || !deadline) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    try {
      await dispatch(
        createTask({
          studentId: currentUser?._id,
          title,
          weight,
          deadline,
        })
      );
      navigate("/student-dashboard");
    } catch (err) {
      setError("Failed to create task.");
    }
  };

  return (
    <div className="student-dashboard booking-page">
      <div className="booking-card">
        <h2>Add Task</h2>
        <form className="booking-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />
          </label>
          <label>
            Weight
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g., 10"
            />
          </label>
          <label>
            Deadline
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </label>
          {error && <div className="task-error">{error}</div>}
          <div className="booking-actions">
            <button type="submit" className="register-button" disabled={loading}>
              {loading ? "Saving..." : "Save Task"}
            </button>
            <button
              type="button"
              className="logout-btn"
              onClick={() => navigate("/student-dashboard")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
