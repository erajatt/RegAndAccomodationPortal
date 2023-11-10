import React, { useState, useEffect } from "react";
import "./accommodation.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

const Accommodation = (props) => {
  const { width, height } = useWindowSize();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);
  const [accommodationSuccess, setAccommodationSuccess] = useState(false);
  const [accompanyingPersons, setAccompanyingPersons] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [accommodationChoice, setaccommodationChoice] = useState("");
  const DarkMode = props.DarkMode;
  const [other1, setOther1] = useState(false);
  const [other2, setOther2] = useState(false);
  const [formData, setFormData] = useState({
    arrivalTime: "",
    departureTime: "",
    accommodationChoice: "",
    accommodationPaymentReceipt: null,
    accommodationPaymentReferenceNumber: "",
    token: "",
  });

  const navigate = useNavigate();
  useEffect(() => {
    const setValues = async (token) => {
      setLoading(true);
      try {
        const response = await axios.post(
          "https://regportal.onrender.com/accommodation/access",
          { token }
        );
        if (response.data.success === "true") {
          setAccompanyingPersons(response.data.accompanyingPersons);
          setIsWaiting(response.data.isWaiting);
          setIsAssigned(response.data.isAssigned);
          setIsStudent(response.data.isStudent);
          console.log("first called", response.data);
          if (isAssigned) {
            try {
              const response1 = await axios.post(
                "https://regportal.onrender.com/accommodation/fetch",
                { token }
              );
              console.log("second called", response1.data.accommodationChoice);
              if (response1.data.success === "true") {
                setaccommodationChoice(response1.data.accommodationChoice);
              }
            } catch (error) {
              toast.error(error);
            }
          }
        }
      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };

    const initializeFormData = () => {
      const cookie = document.cookie;
      const cookieArray = cookie.split("; ");
      const desiredCookie = cookieArray.find((item) =>
        item.startsWith("access_token=")
      );
      if (desiredCookie) {
        const cookieValue = desiredCookie.split("=")[1];
        setValues(cookieValue);
        setFormData({ ...formData, token: cookieValue });
      }
    };

    initializeFormData();
  }, []);

  const handleLogout = () => {
    window.localStorage.clear();
    navigate("/");
    toast.success("Logged out successfully");
  };

  const handleGoBack = () => {
    navigate(-1);
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
    setFormData({ ...formData, accommodationPaymentReceipt: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStep(2);
  };

  const calculatePaymentAmount = (accommodationChoice) => {
    switch (accommodationChoice) {
      case "SHSPSO":
        return 2600;
      case "SHSPDO":
        return 2000;
      case "SHDPDO":
        return 4000;
      case "SHTPSDO":
        return 6600;
      case "Makeshift guest rooms with attached washroom in hostels/quarters - 1000/- per day":
        return 1000;
      case "Guest House (Single room) - 1400/- per day":
        return 1400;
      case "Guest House (Double room with Double occupancy) - 2000/- per day":
        return 2000;
      case "Guest House (Double room with Single occupancy) - 1700/- per day":
        return 1700;
      default:
        return 0;
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    console.log("Submitted");
    // console.log(formData);
    try {
      setLoading(true);
      const response = await axios.post(
        "https://regportal.onrender.com/accommodation/submit",
        formData,
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

  const handleSelectChange1 = (event) => {
    const selectedValue = event.target.value;
    setOther1(selectedValue === "other");
    if (selectedValue === "other") {
      formData.arrivalTime = "";
    }
  };

  const handleSelectChange2 = (event) => {
    const selectedValue = event.target.value;
    setOther2(selectedValue === "other");
    if (selectedValue === "other") {
      formData.departureTime = "";
    }
  };

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

  return (
    <div>
      {step === 1 && <Buttons />}
      {loading ? (
        <Loading />
      ) : (
        <div
          className="form-container"
          style={{ marginBottom: "20px", opacity: 1 }}
        >
          {step === 1 && (
            <div className={`registrationContainer${DarkMode ? "-dark" : ""}`}>
              <h1 style={DarkMode ? { color: "white" } : {}}>Accommodation</h1>
              <p style={{ color: "red", textAlign: "right" }}>
                * -&gt; required fields
              </p>
              <form encType="multipart/form-data" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="labelText" htmlFor="accommodationChoice">
                    Please choose your accommodation preference.
                  </label>
                  <select
                    id="accommodationChoice"
                    name="accommodationChoice"
                    value={formData.accommodationChoice}
                    onChange={handleChange}
                    style={
                      DarkMode
                        ? { backgroundColor: "#555", color: "white" }
                        : {}
                    }
                    required
                  >
                    <option value="">Select</option>
                    {isAssigned === true && (
                      <option value={accommodationChoice}>
                        {accommodationChoice}
                      </option>
                    )}
                    {isAssigned === false && accompanyingPersons === "0" && (
                      <>
                        <option value="SHSPSO">
                          Hostel (single occupancy) – 2600
                        </option>
                        <option value="SHSPDO">
                          Hostel (shared rooms with double occupancy) – 2000
                        </option>
                      </>
                    )}
                    {isAssigned === false && accompanyingPersons === "1" && (
                      <option value="SHDPDO">
                        Hostel (shared rooms with double occupancy) – 4000
                      </option>
                    )}
                    {isAssigned === false && accompanyingPersons === "2" && (
                      <option value="SHTPSDO">
                        Hostel (shared rooms with double occupancy) – 4000 +
                        Hostel (single occupancy) – 2600 = 6600
                      </option>
                    )}
                  </select>
                </div>

                {!other1 && (
                  <div className="form-group">
                    <label className="labelText" htmlFor="arrivalTime">
                      Please choose your arrival date and time.
                    </label>
                    <select
                      id="arrivalTime"
                      name="arrivalTime"
                      value={formData.arrivalTime}
                      onChange={async (e) => {
                        handleChange(e);
                        handleSelectChange1(e);
                      }}
                      style={
                        DarkMode
                          ? { backgroundColor: "#555", color: "white" }
                          : {}
                      }
                      required
                    >
                      <option value="">Select</option>
                      <option value="13th-dec-afternoon/evening">
                        13th December, Afternoon/Evening
                      </option>
                      <option value="14th-dec-morning">
                        14th December, Morning
                      </option>
                      {isStudent && <option value="other">Other</option>}
                    </select>
                  </div>
                )}
                {other1 && (
                  <div className="form-group">
                    <label className="labelText2" htmlFor="Comment">
                      Specify your arrival date and time:
                      <button
                        style={{
                          fontSize: "8px",
                          padding: "5px",
                          marginLeft: "40vh",
                        }}
                        onClick={handleSelectChange1}
                      >
                        Back
                      </button>
                    </label>
                    <textarea
                      id="comment"
                      name="arrivalTime"
                      value={formData.arrivalTime}
                      onChange={handleChange}
                      placeholder="14th December, Morning/Afternoon/Evening"
                      rows={5}
                      style={{
                        width: "100%",
                        resize: "vertical",
                        border: "1px solid black", // Add the border style
                        padding: "5px",
                        backgroundColor: DarkMode ? "#555" : "white",
                        color: DarkMode ? "white" : "black",
                      }}
                    />
                  </div>
                )}
                {!other2 && (
                  <div className="form-group">
                    <label className="labelText" htmlFor="departureTime">
                      Please choose your departure date and time.
                    </label>
                    <select
                      id="departureTime"
                      name="departureTime"
                      value={formData.departureTime}
                      onChange={async (e) => {
                        handleChange(e);
                        handleSelectChange2(e);
                      }}
                      style={
                        DarkMode
                          ? { backgroundColor: "#555", color: "white" }
                          : {}
                      }
                      required
                    >
                      <option value="">Select</option>
                      <option value="17th-dec-afternoon/evening">
                        17th December, Afternoon/Evening
                      </option>
                      <option value="18th-dec-morning">
                        18th December, Morning
                      </option>
                      {isStudent && <option value="other">Other</option>}
                    </select>
                  </div>
                )}
                {other2 && (
                  <div className="form-group">
                    <label className="labelText2" htmlFor="Comment">
                      Specify your departure date and time:
                      <button
                        style={{
                          fontSize: "8px",
                          padding: "5px",
                          marginLeft: "37vh",
                        }}
                        onClick={handleSelectChange2}
                      >
                        Back
                      </button>
                    </label>
                    <textarea
                      id="comment"
                      placeholder="18th December, Morning/Afternoon/Evening"
                      name="departureTime"
                      value={formData.departureTime}
                      onChange={handleChange}
                      rows={5}
                      style={{
                        width: "100%",
                        resize: "vertical",
                        border: "1px solid black", // Add the border style
                        padding: "5px",
                        backgroundColor: DarkMode ? "#555" : "white",
                        color: DarkMode ? "white" : "black",
                      }}
                    />
                  </div>
                )}
                <button type="submit" className="submit-button">
                  Next <span className="next-icon">→</span>
                </button>
              </form>
            </div>
          )}
          {step === 2 && (
            <div
              className={`registrationContainer${DarkMode ? "-dark" : ""}`}
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
                      ₹ {calculatePaymentAmount(formData.accommodationChoice)}
                    </strong>{" "}
                    and come back here to complete the remaining questions
                    below.
                    <br />
                    <br />
                    <a
                      href="https://www.onlinesbi.sbi/sbicollect/icollecthome.htm?corpID=1968961&categoryName=IHMTC2023ACCOMMODATION%20"
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
                      className={`${DarkMode ? "input-dark" : ""}`}
                      type="file"
                      id="accommodationPaymentReceipt"
                      name="accommodationPaymentReceipt"
                      accept="application/pdf, image/*"
                      onChange={handleFileUpload}
                      required
                      style={{
                        margin: "auto",
                        display: "block",
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
                      className={`${DarkMode ? "input-dark" : ""}`}
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
                      Accommodation form submitted successfully! You can now{" "}
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
    </div>
  );
};

export default Accommodation;
