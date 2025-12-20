import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../css/StudentDashboard.css";

const BookMeeting = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const [advisorId, setAdvisorId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!advisorId || !dateTime) {
      alert("Please provide advisor identifier and date/time.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        advisorId,
        studentId: user?.idNumber || user?.email,
        startTime: dateTime,
        locationData: location || "Remote",
        notes,
      };

      await api.post("/scheduleMeeting", payload);
      alert("Meeting request submitted.");
      navigate("/student-dashboard");
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to submit meeting request. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-dashboard booking-page">
      <div className="booking-card">
        <h2>Book Meeting With Advisor</h2>
        <form className="booking-form" onSubmit={handleSubmit}>
          <label>
            Advisor ID or Email
            <input
              type="text"
              value={advisorId}
              onChange={(e) => setAdvisorId(e.target.value)}
              placeholder="advisor id or email"
            />
          </label>

          <label>
            Date & time
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
          </label>

          <label>
            Location (optional)
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Room, building or 'Remote'"
            />
          </label>

          <label>
            Notes (optional)
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Brief description or agenda"
            />
          </label>

          <div className="booking-actions">
            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? "Booking..." : "Book Meeting"}
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

export default BookMeeting;
