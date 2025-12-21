import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../css/StudentDashboard.css";

const BookMeeting = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const [advisor, setAdvisor] = useState(null); // Assigned advisor
  const [dateTime, setDateTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [advisorError, setAdvisorError] = useState("");

  //Fetch advisors
  useEffect(() => {
    const fetchAssignedAdvisor = async () => {
      if (!user) return;
      const identifiers = [
        user?._id?.toString?.(),
        user?.idNumber,
        user?.email,
        user?.studentId,
      ].filter(Boolean);

      if (identifiers.length === 0) return;

      let lastError = "";
      for (const identifier of Array.from(new Set(identifiers))) {
        try {
          const response = await api.get(`/myAdvisor/${identifier}`);
          setAdvisor(response.data);
          setAdvisorError("");
          return;
        } catch (err) {
          lastError = err.response?.data?.error || err.message || lastError;
        }
      }

      setAdvisor(null);
      setAdvisorError(lastError || "No advisor assigned yet.");
      console.error("Error loading advisor:", lastError);
    };
    fetchAssignedAdvisor();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!advisor?._id && !advisor?.idNumber) {
      alert("No advisor assigned. Please contact your advisor.");
      return;
    }
    if (!dateTime) {
      alert("Please choose a date/time.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        advisorId: advisor?.idNumber || advisor?._id,
        studentId: user?.idNumber || user?.email,
        startTime: dateTime,
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
            Advisor
            <input
              type="text"
              value={
                advisor
                  ? `${advisor.firstName || ""} ${advisor.lastName || ""}${
                      advisor.email ? ` (${advisor.email})` : ""
                    }`.trim()
                  : advisorError || "No advisor assigned yet."
              }
              disabled
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
