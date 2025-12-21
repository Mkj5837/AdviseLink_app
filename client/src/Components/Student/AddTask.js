import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createTask } from "../../Features/taskSlice";
import api from "../../api/axios";
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
  const [advisees, setAdvisees] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("self");

  useEffect(() => {
    const fetchAdvisees = async () => {
      if (currentUser?.userType !== "advisor") return;
      const advisorIdentifier = (
        currentUser?.idNumber ||
        currentUser?.email ||
        currentUser?._id ||
        ""
      ).toString();
      if (!advisorIdentifier) return;
      try {
        const res = await api.get(`/myAdvisees/${advisorIdentifier}`);
        setAdvisees(Array.isArray(res.data) ? res.data : []);
        setSelectedStudent("all");
      } catch (err) {
        console.error("Failed to load advisees:", err);
        setAdvisees([]);
      }
    };
    fetchAdvisees();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !weight || !deadline) {
      setError("Please fill in all fields.");
      return;
    }

    // Determine recipients based on role/selection
    let recipients = [];
    if (currentUser?.userType === "advisor") {
      if (selectedStudent === "all") {
        recipients = advisees;
      } else {
        const match = advisees.find((a) => a._id === selectedStudent);
        if (match) recipients = [match];
      }
      if (recipients.length === 0) {
        setError("Select at least one advisee.");
        return;
      }
    } else if (currentUser?._id) {
      recipients = [currentUser];
    } else {
      setError("Missing user info.");
      return;
    }

    setError("");
    try {
      await Promise.all(
        recipients.map((student) =>
          dispatch(
            createTask({
              studentId: student._id,
              title,
              weight,
              deadline,
            })
          ).unwrap()
        )
      );
      const targetRoute =
        currentUser?.userType === "advisor" ? "/dashboard" : "/student-dashboard";
      navigate(targetRoute);
    } catch (err) {
      setError(
        err?.message || "Failed to create task. Please try again."
      );
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
          {currentUser?.userType === "advisor" && (
            <label>
              Assign to
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="all">All advisees</option>
                {advisees.map((advisee) => (
                  <option key={advisee._id} value={advisee._id}>
                    {advisee.firstName} {advisee.lastName} ({advisee.idNumber})
                  </option>
                ))}
              </select>
            </label>
          )}
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
