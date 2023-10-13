import React from "react";
import { useState } from "react";
import "./RegistrationDetails.css";
const RegistrationDetails = ({ formData, earlybird }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div className="fee-breakdown">
      <div className="fee-header" onClick={toggleDropdown}>
        Registration Details{" "}
        <span className={`dropdown-icon ${isDropdownOpen ? "open" : ""}`}>
          ▼
        </span>
      </div>
      {isDropdownOpen && (
        <table className="fee-details">
          {formData.firstName && (
            <tr>
              <td>First Name:</td> <td>{formData.firstName}</td>
            </tr>
          )}
          {formData.middleName && (
            <tr>
              <td>Middle Name:</td> <td>{formData.middleName}</td>
            </tr>
          )}
          {formData.lastName && (
            <tr>
              <td>Last Name:</td> <td>{formData.lastName}</td>
            </tr>
          )}
          {formData.honorific && (
            <tr>
              <td>Honorific:</td> <td>{formData.honorific}</td>
            </tr>
          )}
          {formData.gender && (
            <tr>
              <td>Gender:</td> <td>{formData.gender}</td>
            </tr>
          )}
          {formData.birthYear && (
            <tr>
              <td>Birth Year:</td> <td>{formData.birthYear}</td>
            </tr>
          )}
          {formData.primaryAffiliation && (
            <tr>
              <td>Primary Affiliation:</td>{" "}
              <td>{formData.primaryAffiliation}</td>
            </tr>
          )}
          {formData.country && (
            <tr>
              <td>Country:</td> <td>{formData.country}</td>
            </tr>
          )}
          {formData.email && (
            <tr>
              <td>Email:</td> <td>{formData.email}</td>
            </tr>
          )}
          {formData.contactNumberCode && (
            <tr>
              <td>Contact Number Code:</td>{" "}
              <td>{formData.contactNumberCode}</td>
            </tr>
          )}
          {formData.contactNumber && (
            <tr>
              <td>Contact Number:</td> <td>{formData.contactNumber}</td>
            </tr>
          )}
          {formData.whatsappNumberCode && (
            <tr>
              <td>Whatsapp Number Code:</td>{" "}
              <td>{formData.whatsappNumberCode}</td>
            </tr>
          )}
          {formData.whatsappNumber && (
            <tr>
              <td>Whatsapp Number:</td> <td>{formData.whatsappNumber}</td>
            </tr>
          )}
          {formData.paperCount && (
            <tr>
              <td>Paper Count:</td> <td>{formData.paperCount}</td>
            </tr>
          )}
          {formData.paper1Id && (
            <tr>
              <td>Submission ID of Paper #1:</td> <td>{formData.paper1Id}</td>
            </tr>
          )}
          {formData.paper2Id && (
            <tr>
              <td>Submission ID of Paper #2:</td> <td>{formData.paper2Id}</td>
            </tr>
          )}
          {formData.profile && (
            <tr>
              <td>Profile:</td> <td>{formData.profile}</td>
            </tr>
          )}
          {formData.accompanyingPersons && (
            <tr>
              <td>Accompanying Persons:</td>{" "}
              <td>{formData.accompanyingPersons}</td>
            </tr>
          )}
          {formData.isIshmtMember && (
            <tr>
              <td>Is ISHMT Member?:</td> <td>{formData.isIshmtMember}</td>
            </tr>
          )}
          {formData.ishmtIDFile && (
            <tr>
              <td>ISHMT ID File:</td> <td>Attached on Portal</td>
            </tr>
          )}
          {formData.ishmtIDno && (
            <tr>
              <td>ISHMT ID no:</td> <td>{formData.ishmtIDno}</td>
            </tr>
          )}
          {formData.category && (
            <tr>
              <td>Category:</td> <td>{formData.category}</td>
            </tr>
          )}
          {formData.fee && (
            <tr>
              <td>Fee:</td> <td>₹ {Math.ceil(formData.fee).toFixed(2)}</td>
            </tr>
          )}
        </table>
      )}
    </div>
  );
};

export default RegistrationDetails;
