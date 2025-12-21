import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeetings } from "../../Features/meetingSlice";
import api from "../../api/axios";
import "../../css/StudentDashboard.css";

const MeetingList = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);
  const { items: meetings = [], loading, error } = useSelector(
    (state) => state.meetings || {}
  );
  const isAdvisor = currentUser?.userType === "advisor";
  const [adviseeLookup, setAdviseeLookup] = useState({});

  const stripUpdatedTag = (value) =>
    typeof value === "string" ? value.replace(/-updated/gi, "").trim() : value;

  const formatName = (person = {}) =>
    `${stripUpdatedTag(person.firstName || "")} ${stripUpdatedTag(
      person.lastName || ""
    )}`.trim();

  useEffect(() => {
    if (!isAdvisor) return;
    const advisorIdentifier = (
      currentUser?.idNumber ||
      currentUser?.email ||
      currentUser?._id ||
      ""
    ).toString();
    if (!advisorIdentifier) return;

    let isMounted = true;
    const loadAdvisees = async () => {
      try {
        const res = await api.get(`/myAdvisees/${advisorIdentifier}`);
        if (!isMounted) return;
        const lookup = {};
        (Array.isArray(res.data) ? res.data : []).forEach((stud) => {
          const name = formatName(stud) || "--";
          if (stud?._id) lookup[stud._id] = name;
          if (stud?.idNumber) lookup[stud.idNumber] = name;
          if (stud?.email) lookup[stud.email] = name;
        });
        setAdviseeLookup(lookup);
      } catch (err) {
        console.error("Error loading advisees:", err);
      }
    };

    loadAdvisees();
    return () => {
      isMounted = false;
    };
  }, [isAdvisor, currentUser]);

  useEffect(() => {
    if (!currentUser?._id) return;
    const params =
      currentUser.userType === "advisor"
        ? { advisorId: currentUser._id }
        : { studentId: currentUser._id };
    dispatch(fetchMeetings(params));
  }, [currentUser, dispatch]);

  const formatDate = (date) => {
    if (!date) return "--";
    try {
      return new Date(date).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (e) {
      return date;
    }
  };

  const formatPerson = (person) => {
    if (!person) return "--";
    if (typeof person === "string") {
      return adviseeLookup[person] || person;
    }
    const name = formatName(person);
    return (
      name ||
      adviseeLookup[person._id] ||
      person.idNumber ||
      person.email ||
      person._id ||
      "--"
    );
  };

  const formatNotes = (notes) => {
    const text = (notes || "").trim();
    return text || "--";
  };

  const helperText = isAdvisor
    ? "Review meetings booked by your advisees."
    : "View your upcoming advisor meetings. Book a new one if needed.";

  return (
    <div className="student-dashboard booking-page">
      <div className="booking-card">
        <h2>Meeting List</h2>
        <p className="checkin-subtext">{helperText}</p>
        <div className="tasks-table meeting-table" style={{ marginTop: "12px" }}>
          <div className="table-header">
            <span>{isAdvisor ? "Student" : "Title"}</span>
            <span>Status</span>
            <span>When</span>
            <span>{isAdvisor ? "Notes" : "Location"}</span>
          </div>
          {loading ? (
            <div className="task-row">
              <span>Loading meetings...</span>
              <span>--</span>
              <span>--</span>
              <span>--</span>
            </div>
          ) : meetings.length === 0 ? (
            <div className="task-row">
              <span>No meetings yet.</span>
              <span>--</span>
              <span>--</span>
              <span>--</span>
            </div>
          ) : (
            meetings.map((m) => (
              <div key={m._id} className="task-row">
                <span>
                  {isAdvisor
                    ? formatPerson(m.studentId)
                    : m.meetingType || "Advisor Meeting"}
                </span>
                <span>{m.status || "scheduled"}</span>
                <span>{formatDate(m.startTime)}</span>
                <span>
                  {isAdvisor ? formatNotes(m.notes) : m.location || "Remote"}
                </span>
              </div>
            ))
          )}
        </div>
        {error && <div className="task-error">{error}</div>}
        {!isAdvisor && (
          <div className="booking-actions" style={{ marginTop: "16px" }}>
            <Link
              to="/book-meeting"
              className="register-button"
              style={{ textAlign: "center", textDecoration: "none" }}
            >
              Book Meeting
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingList;
