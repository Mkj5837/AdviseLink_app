import React from "react";
import stud1 from "../Images/avatars/student1.jpg";
import stud2 from "../Images/avatars/stud2.jpg";

const AdviseesList = () => {
  const recentAdvisees = [
    {
      name: "Francis Tran",
      image: "../Images/avatars/student1.jpg",
      timeAgo: "05 Minutes Ago",
    },
    {
      name: "Elliana Palacios",
      image: "../Images/avatars/stud2.jpg",
      timeAgo: "23 Minutes Ago",
    },
    {
      name: "Katherine Webster",
      image: "/avatars/katherine.png",
      timeAgo: "10 Minutes Ago",
    },
    {
      name: "Avalon Carey",
      image: "/avatars/avalon.png",
      timeAgo: "10 Minutes Ago",
    },
  ];

  return (
    <div className="advisees-list">
      <h2>Advisees Added last 10 Days</h2>

      <div className="advisees-container">
        {recentAdvisees.map((advisee, index) => (
          <div key={index} className="advisee-item">
            <img
              src={advisee.image}
              alt={advisee.name}
              className="advisee-avatar"
            />
            <div className="advisee-info">
              <h3>{advisee.name}</h3>
              <span className="time-ago">{advisee.timeAgo}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="view-more-btn">View More</button>
    </div>
  );
};

export default AdviseesList;
