import React from "react";
import "../About.css";

const About = () => {
  const teamMembers = [
    {
      name: "Zamzam Tabook",
      role: "Backend developer",
      social: {
        facebook: "#",
        github: "#",
        linkedin: "#",
      },
    },
    {
      name: "Malak Al-Jabri",
      role: "Frontend Developer",
      social: {
        facebook: "#",
        github: "#",
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
                  <a href={member.social.facebook} aria-label="Facebook">
                    <i className="fab fa-facebook"></i>
                  </a>
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
            LoremIpsum LoremIpsum LoremIpsum LoremIpsum LoremIpsum LoremIpsum
            LoremIpsum LoremIpsum LoremIpsum LoremIpsum LoremIpsum LoremIpsum
            LoremIpsum LoremIpsum LoremIpsum LoremIpsum LoremIpsum LoremIpsum.
          </p>
          <p>
            LoremIpsum LoremIpsum LoremIpsum LoremIpsum LoremIpsum LoremIpsum
            LoremIpsum LoremIpsum LoremIpsum LoremIpsum LoremIpsum LoremIpsum.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
