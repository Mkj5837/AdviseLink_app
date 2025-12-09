import React from "react";
import "../About.css";

const About = () => {
  const teamMembers = [
    {
      name: "Zamzam Tabook",
      role: "Backend developer",
      social: {
        github: "@annie",
        linkedin: "#",
      },
    },
    {
      name: "Malak Al-Jabri",
      role: "Frontend Developer",
      social: {
        github: "@Mkj5837",
        linkedin: "#",
      },
    },
  ];

  return (
    <div className="about-container">
      <div className="about-content">
        <div className="about-header">
          <img src="/logo.png" alt="AdviseLink" className="about-logo" />
        </div>

        <div className="team-section">
          <div className="team-badge">
            <i className="fas fa-users"></i>
            Our team
          </div>

          <div className="team-members">
            {teamMembers.map((member, index) => (
              <div key={index} className="member-card">
                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>
                <div className="social-links">
                  <a href={member.social.github} aria-label="GitHub">
                    <i className="fab fa-github"></i>
                  </a>
                  <a href={member.social.linkedin} aria-label="LinkedIn">
                    <i className="fab fa-linkedin"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <button className="contact-button">
            Contact Us
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>

        <div className="about-text">
          <h2>About Us</h2>
          <p>
            Zamzam Tabook is a backend developer who is passionate about
            creating robust and scalable server-side applications.
          </p>
          <p>
            Malak Al-Jabri is a frontend developer who is passionate about
            creating beautiful and functional user interfaces and is quite a
            perfectionist.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
