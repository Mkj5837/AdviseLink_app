import React from "react";
import "../Logo.css";
import bglogo from "../Images/AdviseLinkLogo.png";

const Logo = () => {
  // { size = "80px" }
  return (
    <div className="logo-container">
      {/* <div className="circle-background"></div> */}
      <div className="logo">
        <img src={bglogo} alt="AdviseLink Logo" />
      </div>
    </div>
  );
};

export default Logo;
