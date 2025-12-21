import React from "react";
import "../css/About.css";

const About = () => {
  const teamMembers = [
    {
      name: "Zamzam Tabouk",
      role: "Backend Developer",
      description:
        "Dedicated to building scalable server-side logic and managing database integrity to ensure a seamless AdviseLink experience.",
      github: "https://github.com/anne32z",
      linkedin: "https://linkedin.com/",
    },
    {
      name: "Malak al-Jabri",
      role: "Front-end Developer",
      description:
        "Dedicated to providing a smooth user experience and managing client-side logic ensuring a seamless AdviseLink experience.",
      github: "https://github.com/Mkj5837",
      linkedin: "https://linkedin.com/",
    },
  ];

  return (
    <div className="about-container">
      <h1>About AdviseLink</h1>

      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div className="member-card" key={index}>
            <h3>{member.name}</h3>
            <p className="role">{member.role}</p>
            <p className="description">{member.description}</p>

            <div className="social-icons">
              <a href={member.github} target="_blank">
                <i className="fab fa-github"></i>
              </a>
              <a href={member.linkedin} target="_blank">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
