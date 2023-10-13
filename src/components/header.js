import React from "react";
import headerImage from "../assets/headerImg2.jpeg"; // Replace with the actual path to your image
import "./header.css";
const Header = () => {
  return (
    <div className="header-container">
      <div
        className="header"
        style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
      >
        <a href="https://ihmtc2023.iitp.ac.in/" target="_blank">
          <img
            src={headerImage}
            alt="Header"
            className="header-image" // Add this className
            style={{
              // height: "80%",
              width: "100%",
              // marginLeft: "2vh",
              // marginRight: "2vh",
            }}
          />
        </a>
      </div>
    </div>
  );
};

export default Header;