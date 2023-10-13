import React from "react";
import { Link } from "react-router-dom";
import iitpLogo from "../assets/iitpLogo.png";
import "./Footer.css"; // You can create a CSS file for styling the footer

const Footer = () => {
  return (
    <footer className="custom-footer">
      <div className="footer-content">
        <div className="logo-section">
          <a href="https://iitp.ac.in/" className="logo-link">
            <img src={iitpLogo} className="logo-image" alt="IITP Logo" />
            <span className="logo-text">IIT Patna</span>
          </a>
        </div>
        <ul className="footer-links">
          <li>
            <a
              href="https://ihmtc2023.iitp.ac.in/"
              className="footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              IHMTC 2023
            </a>
          </li>
          <li>
            <a
              href="https://ihmtc2023.iitp.ac.in/IHMTC_2023_Poster.pdf"
              className="footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Conference Brochure
            </a>
          </li>
          <li>
            <a
              href="mailto:ihmtc2023@gmail.com"
              className="footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
      <hr className="footer-divider" />
      <span className="footer-copyright">
        2023-24{" "}
        <a href="https://iitp.ac.in/" className="copyright-link">
          Copyright © IITP. All rights reserved.
        </a>
      </span>
    </footer>
  );
};

export default Footer;
