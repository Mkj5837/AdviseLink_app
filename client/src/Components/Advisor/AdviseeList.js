import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../api/axios";

const formatTimeAgo = (date) => {
  if (!date) return "Recently added";
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (hours > 0) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (minutes > 0) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  return "Just now";
};

const stripUpdatedTag = (value) =>
  typeof value === "string" ? value.replace(/-updated/gi, "").trim() : value;

const formatName = (advisee = {}) =>
  `${stripUpdatedTag(advisee.firstName || "")} ${stripUpdatedTag(
    advisee.lastName || ""
  )}`.trim();

const getInitials = (firstName = "", lastName = "") => {
  const first = stripUpdatedTag(firstName).trim()[0] || "";
  const last = stripUpdatedTag(lastName).trim()[0] || "";
  return (first + last || "?").toUpperCase();
};

const AdviseesList = () => {
  const advisor = useSelector((state) => state.user.user);
  const [recentAdvisees, setRecentAdvisees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecentAdvisees = async () => {
      if (!advisor) return;
      const advisorIdentifier =
        advisor.idNumber || advisor._id || advisor.email;
      if (!advisorIdentifier) return;

      setLoading(true);
      try {
        const res = await api.get(`/myAdvisees/${advisorIdentifier}`);
        const tenDaysAgo = Date.now() - 10 * 24 * 60 * 60 * 1000;

        const parsed = (Array.isArray(res.data) ? res.data : [])
          .map((stud) => ({
            ...stud,
            addedAt: stud.addedAt ? new Date(stud.addedAt) : null,
          }))
          .filter(
            (stud) =>
              !stud.addedAt || stud.addedAt.getTime() >= tenDaysAgo
          );

        setRecentAdvisees(parsed);
      } catch (err) {
        console.error("Error loading recent advisees:", err);
        setRecentAdvisees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAdvisees();
  }, [advisor]);

  return (
    <div className="advisees-list">
      <h2>Advisees Added last 10 Days</h2>

      {loading ? (
        <p>Loading advisees...</p>
      ) : recentAdvisees.length === 0 ? (
        <p>No advisees added in the last 10 days.</p>
      ) : (
        <div className="advisees-container">
          {recentAdvisees.map((advisee) => (
            <div key={advisee.idNumber || advisee._id} className="advisee-item">
              <div className="advisee-avatar avatar-placeholder">
                {getInitials(advisee.firstName, advisee.lastName)}
              </div>
              <div className="advisee-info">
                <h3>{formatName(advisee) || "--"}</h3>
                <span className="time-ago">
                  {formatTimeAgo(advisee.addedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdviseesList;
