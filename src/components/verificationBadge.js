import React from "react";
import "./verificationBadge.css"; // Import your CSS file
import Pending from "@mui/icons-material/Pending";
import CheckCircle from "@mui/icons-material/CheckCircle";

const VerificationBadge = ({ isVerified }) => {
  const tooltipText = isVerified ? "Verified" : "Pending Verification";

  return (
    <div
      className={`verification-badge ${isVerified ? "verified" : "pending"}`}
    >
      {isVerified ? (
        <CheckCircle
          style={{
            color: "rgb(0, 128, 55)",
            transform: "rotate(0deg)",
            borderStyle: "solid",
            //   fontSize: "125px",
            borderColor: "rgb(0, 0, 0)",
            padding: "0px",
            borderRadius: "50%",
            borderWidth: "1px",
          }}
        />
      ) : (
        <Pending
          style={{
            color: "rgb(211 213 67)",
            transform: "rotate(0deg)",
            borderStyle: "solid",
            //   fontSize: "125px",
            borderColor: "rgb(0, 0, 0)",
            padding: "0px",
            borderRadius: "50%",
            borderWidth: "1px",
          }}
        />
      )}
      <div className="tooltipx">{tooltipText}</div>
    </div>
  );
};

export default VerificationBadge;
