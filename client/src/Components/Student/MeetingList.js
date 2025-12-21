import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeetings } from "../../Features/meetingSlice";
import "../../css/StudentDashboard.css";

const MeetingList = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);
  const { items: meetings = [], loading, error } = useSelector(
    (state) => state.meetings || {}
  );

  useEffect(() => {
    if (!currentUser?._id) return;
    const params =
      currentUser.userType === "advisor"
        ? { advisorId: currentUser._id }
        : { studentId: currentUser._id };
    dispatch(fetchMeetings(params));
  }, [currentUser, dispatch]);

  const formatDate = (date) => {
    if (!date) return "—";
    try {
      return new Date(date).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (e) {
      return date;
    }
  };

  return (
    <div className="student-dashboard booking-page">
      <div className="booking-card">
        <h2>Meeting List</h2>
        <p className="checkin-subtext">
          View your upcoming advisor meetings. Book a new one if needed.
        </p>
        <div className="tasks-table" style={{ marginTop: "12px" }}>
          <div className="table-header">
            <span>Title</span>
            <span>Status</span>
            <span>When</span>
            <span>Location</span>
          </div>
          {loading ? (
            <div className="task-row">
              <span>Loading meetings...</span>
              <span>—</span>
              <span>—</span>
              <span>—</span>
            </div>
          ) : meetings.length === 0 ? (
            <div className="task-row">
              <span>No meetings yet.</span>
              <span>—</span>
              <span>—</span>
              <span>—</span>
            </div>
          ) : (
            meetings.map((m) => (
              <div key={m._id} className="task-row">
                <span>{m.meetingType || "Advisor Meeting"}</span>
                <span>{m.status || "scheduled"}</span>
                <span>{formatDate(m.startTime)}</span>
                <span>{m.location || "Remote"}</span>
              </div>
            ))
          )}
        </div>
        {error && <div className="task-error">{error}</div>}
        <div className="booking-actions" style={{ marginTop: "16px" }}>
          <Link
            to="/book-meeting"
            className="register-button"
            style={{ textAlign: "center", textDecoration: "none" }}
          >
            Book Meeting
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MeetingList;
