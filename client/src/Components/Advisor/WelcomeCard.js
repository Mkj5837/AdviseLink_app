import React from "react";

const WelcomeCard = () => {
  return (
    <div className="welcome-card">
      <div className="welcome-content">
        <h2>WELCOME BACK!</h2>
        <p>You have connected with 60% of your advisees this week!</p>
        {/* <button className="learn-more-btn">Learn More</button> */}
      </div>
      <div className="welcome-image">
        <img src="/advisor-illustration.png" alt="Advisor" />
      </div>
    </div>
  );
};

export default WelcomeCard;
