import React, { useState } from "react";
import { useEffect } from "react";
import "./FeeBreakdown.css";
import { DateTime } from "luxon";

const IST = "Asia/Kolkata";

const FeeBreakdown = ({
  categoryFees,
  paperFees,
  accompanyingFees,
  formData,
  res,
  DarkMode
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [earlybird, setEarlybird] = useState(false);
  const baseFee = earlybird
    ? categoryFees[res.category]
    : categoryFees[res.category] * 1.25;
  const paperFee = formData.paperCount
    ? earlybird
      ? categoryFees[res.category] * paperFees[formData.paperCount]
      : categoryFees[res.category] * paperFees[formData.paperCount] * 1.25
    : 0;
  const accompanyingFee = formData.accompanyingPersons
    ? earlybird
      ? formData.accompanyingPersons * accompanyingFees[res.category]
      : formData.accompanyingPersons * accompanyingFees[res.category] * 1.25
    : 0;

  const totalFees =
    (baseFee ? baseFee : 0) +
    (paperFee ? paperFee : 0) +
    (accompanyingFee ? accompanyingFee : 0);

  useEffect(() => {
    const currentDate = DateTime.now().setZone(IST);
    const targetDate = DateTime.fromISO("2023-10-31", { zone: IST });
    if (currentDate <= targetDate) {
      setEarlybird(true);
    } else {
      setEarlybird(false);
    }
  }, []);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={`fee-breakdown${DarkMode?"-dark":""}`}>
      <div className="fee-header" onClick={toggleDropdown}>
        Fee Breakdown{" "}
        <span className={`dropdown-icon ${isDropdownOpen ? "open" : ""}`}>
          ▼
        </span>
      </div>
      {isDropdownOpen && (
        <table className={`fee-details${DarkMode?"-dark":""}`}>
          <tr>
            <td>Base Fees according to your category:</td>
            <td></td>
            <td classname="right-align third-column">₹ {baseFee.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Papers you are presenting:</td>
            <td>[{formData.paperCount}]</td>
            <td classname="right-align third-column">
              ₹{" "}
              {formData.paperCount !== "0"
                ? paperFee.toFixed(2)
                : (0).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td>Person Accompanying you:</td>
            <td>[{formData.accompanyingPersons}]</td>
            <td classname="right-align third-column">
              ₹ {accompanyingFee.toFixed(2)}
            </td>
          </tr>
          {earlybird && (
            <>
              <tr>
                <td>GST (18%):</td>
                <td></td>
                <td classname="right-align third-column" colspan="2">
                  ₹ {(totalFees * 0.18).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td>Total Fees:</td>
                <td></td>
                <td classname="right-align third-column" colspan="2">
                  ₹ {Math.ceil(res.fee).toFixed(2)}
                </td>
              </tr>
            </>
          )}
          {!earlybird && (
            <>
              <tr>
                <td>GST (18%):</td>
                <td></td>
                <td classname="right-align third-column" colspan="2">
                  ₹ {(totalFees * 0.18).toFixed(2)}
                </td>
              </tr>

              <tr>
                <td>Total Fees:</td>
                <td></td>
                <td classname="right-align third-column" colspan="2">
                  ₹ {Math.ceil(totalFees * 1.18).toFixed(2)}
                </td>
              </tr>
            </>
          )}
        </table>
      )}
    </div>
  );
};

export default FeeBreakdown;
