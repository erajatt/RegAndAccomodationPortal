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
  //   const [accompanyingPersons, setAccompanyingPersons] = useState("");
  //   const [isWaiting, setIsWaiting] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);
  //   const [isStudent, setIsStudent] = useState(false);
  const [accommodationChoice, setAccommodationChoice] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("1");
  const DarkMode = props.DarkMode;

  const [formData, setFormData] = useState({
    arrivalDate: "",
    arrivalTime: "",
    departureDate: "",
    departureTime: "",
    accommodationChoice: null,
    accommodationPaymentReceipt: null,
    accommodationPaymentReferenceNumber: "",
    token: "",
  });

  const [isDepartureVaild, setIsDepartureValid] = useState(false);
  const navigate = useNavigate();

  const validateDeparture = () => {
    const arDate = `${formData.arrivalDate} 2023`;
    // console.log(arDate);
    const arTime = `${formData.arrivalTime}:00:00`;
    // console.log(arTime);

    const drDate = `${formData.departureDate} 2023`;
    // console.log(arDate);
    const drTime = `${formData.departureTime}:00:00`;
    // console.log(arTime);
    

    const arrivalDateTime = new Date(
      `${arDate} ${arTime}`
    );
    const departureDateTime = new Date(
      `${drDate} ${drTime}`
    );

    // console.log(arrivalDateTime, departureDateTime);
    const isValid = departureDateTime >= arrivalDateTime;

    setIsDepartureValid(isValid);

    
    return isValid;
  };

  const setValues = async (token) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://regportal.onrender.com/accommodation/access",
        { token }
      );
      console.log(response.data, "res");
      if (response.data && response.data.success === "true") {
        //   setAccompanyingPersons(response.data.accompanyingPersons);
        //   setIsWaiting(response.data.isWaiting);
        const updatedIsAssigned = response.data.isAssigned;
        setIsAssigned(updatedIsAssigned);
        // console.log(updatedIsAssigned, 'u');
        //   setIsStudent(response.data.isStudent);
        // console.log("first called", response.data);
        // console.log(isAssigned);
        if (updatedIsAssigned) {
          // console.log("1");
          setLoading(true);
          try {
            const response1 = await axios.post(
              "https://regportal.onrender.com/accommodation/fetch",
              { token }
            );
            console.log("second called", response1.data.accommodationChoice);
            if (response1.data.success === "true") {
              setAccommodationChoice(response1.data.accommodationChoice);
            }
          } catch (error) {
            toast.error(error);
          } finally {
            setLoading(false);
          }
        }
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const initializeFormData = async () => {
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

  useEffect(() => {
    initializeFormData();
  }, []);

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

  const handleSubmit = async (token) => {
    if (!validateDeparture()) {
      toast.error("Invalid Arrival and Departure Date & Time");
    } else {
      try {
        setLoading(true);
        const response = await axios.post(
          "https://regportal.onrender.com/accommodation/fee",
          formData
        );
        console.log(formData);
        if (response.data.success === "true") {
          setPaymentAmount(response.data.accommodationFees);
          setStep(2);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Something went wrong! Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();

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

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour <= 23; hour++) {
      const time12Format =
        (hour % 12 === 0 ? 12 : hour % 12) + (hour < 12 ? " AM" : " PM");
      options.push(
        <option key={hour} value={hour}>
          {time12Format}
        </option>
      );
    }
    return options;
  };

  //   const handleSelectChange1 = (event) => {
  //     const selectedValue = event.target.value;
  //     setOther1(selectedValue === "other");
  //     if (selectedValue === "other") {
  //       formData.arrivalTime = "";
  //     }
  //   };

  //   const handleSelectChange2 = (event) => {
  //     const selectedValue = event.target.value;
  //     setOther2(selectedValue === "other");
  //     if (selectedValue === "other") {
  //       formData.departureTime = "";
  //     }
  //   };

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
              <form
                encType="multipart/form-data"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
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
                    {isAssigned === true && accommodationChoice && (
                      <option value={accommodationChoice}>
                        {accommodationChoice}
                      </option>
                    )}

                    {!accommodationChoice && (
                      <option value="Makeshift guest rooms with attached washrooms in
                      hostels/quarters - 1000/- per day, per head">
                        Makeshift guest rooms with attached washrooms in
                        hostels/quarters - 1000/- per day, per head
                      </option>
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label className="labelText" htmlFor="arrivalDate">
                    Please choose your arrival date.
                  </label>
                  <select
                    id="arrivalDate"
                    name="arrivalDate"
                    value={formData.arrivalDate}
                    onChange={handleChange}
                    style={
                      DarkMode
                        ? { backgroundColor: "#555", color: "white" }
                        : {}
                    }
                    required
                  >
                    <option value="">Select</option>
                    <option value="12 December">12th December</option>
                    <option value="13 December">13th December</option>
                    <option value="14 December">14th December</option>
                    <option value="15 December">15th December</option>
                    <option value="16 December">16th December</option>
                    <option value="17 December">17th December</option>
                    <option value="18 December">18th December</option>
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
                    style={
                      DarkMode
                        ? { backgroundColor: "#555", color: "white" }
                        : {}
                    }
                    required
                  >
                    <option value="">Select</option>
                    {generateTimeOptions()}
                  </select>
                </div>

                <div className="form-group">
                  <label className="labelText" htmlFor="departureDate">
                    Please choose your departure date.
                  </label>
                  <select
                    id="departureDate"
                    name="departureDate"
                    value={formData.departureDate}
                    onChange={handleChange}
                    style={
                      DarkMode
                        ? { backgroundColor: "#555", color: "white" }
                        : {}
                    }
                    required
                  >
                    <option value="">Select</option>
                    <option value="12 December">12th December</option>
                    <option value="13 December">13th December</option>
                    <option value="14 December">14th December</option>
                    <option value="15 December">15th December</option>
                    <option value="16 December">16th December</option>
                    <option value="17 December">17th December</option>
                    <option value="18 December">18th December</option>
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
                    style={
                      DarkMode
                        ? { backgroundColor: "#555", color: "white" }
                        : {}
                    }
                    required
                  >
                    <option value="">Select</option>
                    {generateTimeOptions()}
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
                    <strong>₹ {paymentAmount}</strong> and come back here to
                    complete the remaining questions below.
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
