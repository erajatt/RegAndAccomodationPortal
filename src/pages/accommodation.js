import React, { useState, useEffect } from "react";
import "./accommodation.css"; // Import the CSS file
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti, { ReactConfetti } from "react-confetti";

const Accommodation = () => {
  const { width, height } = useWindowSize();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);
  const [accommodationSuccess, setAccommodationSuccess] = useState(false);
  const [accompanyingPersons, setAccompanyingPersons] = useState("");

  const [formData, setFormData] = useState({
    arrivalTime: "",
    departureTime: "",
    accommodationType: "",
    accommodationPaymentReceipt: null,
    accommodationPaymentReferenceNumber: "",
    token: "",
  });

  const setValues = async (token) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://regportal.onrender.com/accommodation/access",
        { token }
      );
      if (response.data) {
        setAccompanyingPersons(response.data.accompanyingPersons);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
      // handleDownloadUserData(cv);
    }
  };

  useEffect(() => {
    const cookie = document.cookie;
    const cookieArray = cookie.split("; ");
    const desiredCookie = cookieArray.find((item) =>
      item.startsWith("access_token=")
    );
    if (desiredCookie) {
      const cookieValue = desiredCookie.split("=")[1];
      setValues(cookieValue);
      formData.token = cookieValue;
    }
  }, []);

  const Buttons = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
      window.localStorage.clear();
      navigate("/");
      toast.success("Logged out successfully");
    };

    const handleGoBack = () => {
      navigate(-1);
    };

    return (
      <div className="buttons-container">
        {!accommodationSuccess && (
          <button className="back-button" onClick={handleGoBack}>
            Back
          </button>
        )}
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      accommodationPaymentReceipt: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    console.log("Submitted");
    try {
      setLoading(true);
      const response = await axios.post(
        "https://regportal.onrender.com/accommodation/submit",
        formData ,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      if (response.data.success === "false") toast.error(response.data.message);
      else {
        setAccommodationSuccess(true);
        toast.success("Form Submitted Successfully!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  function calculatePaymentAmount(accommodationType) {
    switch (accommodationType) {
      case "SHSPSO":
        return 2600;
      case "SHSPDO":
        return 2000;
      case "SHDPDO":
        return 4000;
      case "SHTPSDO":
        return 6600;
      default:
        return 0;
    }
  }

  return (
    <>
      {step === 1 && <Buttons />}
      {loading ? (
        <Loading />
      ) : (
        <div
          className="form-container"
          style={{ marginBottom: "20px", opacity: 1 }}
        >
          {step === 1 && (
            <div className="registrationContainer">
              <h1>Accommodation</h1>
              <p style={{ color: "red", textAlign: "right" }}>
                * -&gt; required fields
              </p>
              <form encType="multipart/form-data" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="labelText" htmlFor="accommodationType">
                    Please choose your accommodation preference.
                  </label>
                  <select
                    id="accommodationType"
                    name="accommodationType"
                    value={formData.accommodationType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    {accompanyingPersons === "0" && (
                      <>
                        <option value="SHSPSO">
                          Hostel (single occupancy) – 2600
                        </option>
                        <option value="SHSPDO">
                          Hostel (shared rooms with double occupancy) – 2000
                        </option>
                      </>
                    )}
                    {accompanyingPersons === "1" && (
                      <option value="SHDPDO">
                        Hostel (shared rooms with double occupancy) – 4000
                      </option>
                    )}
                    {accompanyingPersons === "2" && (
                      <option value="SHTPSDO">
                        Hostel (shared rooms with double occupancy) – 4000 +
                        Hostel (single occupancy) – 2600 = 6600
                      </option>
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label className="labelText" htmlFor="arrivalTime">
                    Please choose your arrival time.
                  </label>
                  <select
                    id="arrivalTime"
                    name="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="13th-dec-afternoon/evening">
                      13th December, Afternoon/Evening
                    </option>
                    <option value="14th-dec-morning">
                      14th December, Morning
                    </option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="labelText" htmlFor="departureTime">
                    Please choose your departure time.
                  </label>
                  <select
                    id="departureTime"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="17th-dec-afternoon/evening">
                      17th December, Afternoon/Evening
                    </option>
                    <option value="18th-dec-morning">
                      18th December, Morning
                    </option>
                  </select>
                </div>
                <button type="submit" className="submit-button">
                  Next <span className="next-icon">→</span>
                </button>
              </form>
            </div>
          )}
          {step === 2 && (
            <div
              className="registrationContainer"
              style={{ marginBottom: "20px" }}
            >
              {!accommodationSuccess && (
                <button
                  className="backbutton"
                  type="button"
                  onClick={() => setStep(1)}
                >
                  <span className="back-icon">←</span> Back
                </button>
              )}

              <br></br>
              {!accommodationSuccess && (
                <>
                  <p>
                    Please visit the following payment link, provide the
                    relevant information, make the payment of{" "}
                    <strong>
                      ₹ {calculatePaymentAmount(formData.accommodationType)}
                    </strong>{" "}
                    and come back here to complete the remaining questions
                    below.
                    <br />
                    <br />
                    <a
                      href="https://www.onlinesbi.sbi/sbicollect/icollecthome.htm?corpID=1968961&categoryName=IHMTC-2023"
                      target="_blank" // Opens the link in a new tab
                      rel="noopener noreferrer" // Recommended for security when using target="_blank"
                      className="payment-link-button"
                    >
                      Click to go to payment link
                    </a>
                  </p>
                </>
              )}
              <br />
              <form encType="multipart/form-data" onSubmit={handleSubmit2}>
                {!accommodationSuccess && (
                  <div className="form-group">
                    <label
                      className="labelText"
                      htmlFor="accommodationPaymentReceipt"
                    >
                      Upload the copy (PDF or image) of the accommodation
                      payment receipt.
                    </label>
                    <input
                      type="file"
                      id="accommodationPaymentReceipt"
                      name="accommodationPaymentReceipt"
                      accept="application/pdf, image/*"
                      onChange={handleFileUpload}
                      required
                      style={{
                        margin: "auto",
                        display: "block", // Ensure the input takes up full width
                        width: "100%",
                      }}
                    />
                    <p className="disclaimer">
                      Note: The file you upload will be considered valid as per
                      your input. Make sure it contains the necessary
                      information.
                    </p>
                  </div>
                )}
                {!accommodationSuccess && (
                  <div className="form-group">
                    <label
                      className="labelText"
                      htmlFor="accommodationPaymentReferenceNumber"
                    >
                      Enter your SBCollect reference number :
                      <br />
                      <span className="disclaimer">(Format: DUF5316282)</span>
                    </label>
                    <input
                      type="text"
                      id="accommodationPaymentReferenceNumber"
                      name="accommodationPaymentReferenceNumber"
                      value={formData.accommodationPaymentReferenceNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                {!accommodationSuccess && (
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={isDeclarationChecked}
                        required
                        onChange={() =>
                          setIsDeclarationChecked(!isDeclarationChecked)
                        }
                      />
                      I declare that the information I have provided is correct.
                    </label>
                    <br />
                    <br />

                    <button
                      type="submit"
                      className={`submit-button ${
                        !isDeclarationChecked && "disabled"
                      }`}
                      disabled={!isDeclarationChecked}
                      onClick={(event) => {
                        const confirmation = window.confirm(
                          "Are you sure you want to submit the form? This action can't be undone."
                        );
                        if (!confirmation) {
                          event.preventDefault();
                        }
                      }}
                    >
                      Submit
                    </button>
                  </div>
                )}

                {accommodationSuccess && (
                  <div className="success-message">
                    <p className="success-text">
                      Accommodation successful! You can now{" "}
                      <Link to="/home" className="return-link">
                        return to the homepage
                      </Link>
                      .
                    </p>
                  </div>
                )}
              </form>
            </div>
          )}
          {accommodationSuccess && (
            <div className="conf" style={{ top: 0, position: "fixed" }}>
              <Confetti width={width} height={height} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Accommodation;
