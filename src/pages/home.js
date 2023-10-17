import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./home.css"; // Assuming you have your styles in a separate file
import axios from "axios";
import Loading from "../components/Loading";
import RegistrationDetailsVerif from "../components/RegistrationDetailsVerif.js";
import { toast } from "react-toastify";
import FileDownload from "../components/FileDownload";
import useWindowSize from "react-use/lib/useWindowSize";

const Home = (props) => {
  const { width, height } = useWindowSize();
  const [isAdmin, setAdmin] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [formFilled, setFormFilled] = useState(false);
  const [accommodationVerified, setAccommodationVerified] = useState(false);
  const [accommodationFormFilled, setAccommodationFormFilled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData1, setFormData1] = useState({});
  const [cv, setCv] = useState(0);
  const [emailID, setEmailID] = useState(null);
  const [isStudent, setIsStudent] = useState(false);
  const [showAccommodationModal, setShowAccommodationModal] = useState(false);
  const [token, setToken] = useState(null);
  const [isWaiting, setIsWaiting] = useState("false");
  const navigate = useNavigate();
  const DarkMode = props.DarkMode;
  const setValues = async (token) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://regportal.onrender.com/auth/userAccess",
        { token }
      );
      if (response.data) {
        console.log(response.data);
        setAdmin(response.data.isAdmin);
        setEmailID(response.data.userEmail);
        setIsVerified(response.data.isVerified);
        setFormFilled(response.data.formFilled);
        setAccommodationFormFilled(response.data.accommodationFormFilled);
        setAccommodationVerified(response.data.accommodationVerified);
      }
    } catch (error) {
      toast.error(error);
    }

    try {
      const response = await axios.post(
        "https://regportal.onrender.com/accommodation/access",
        { token }
      );
      if (response.data) {
        console.log(response.data);
        setIsStudent(response.data.isStudent);
        setIsWaiting(response.data.isWaiting);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
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
      setCv(cookieValue);
      setValues(cookieValue);
      setToken(cookieValue);
    }
  }, []);

  useEffect(() => {
    if (emailID) {
      handleDownloadUserData(cv);
    }
  }, [emailID]);

  const handleLogout = () => {
    window.localStorage.clear();
    navigate("/");
    toast.success("Logged out successfully");
  };

  const handleDownloadUserData = async (userID) => {
    axios({
      url: `https://regportal.onrender.com/auth/userDetails`,
      method: "POST",
      responseType: "json", // Set the response type to JSON
      data: { userID: userID, token: cv, email: emailID },
    })
      .then((response) => {
        setLoading(true);
        const formData = response.data.usersData;
        const success = response.data.success;
        if (success === "false") {
          toast.warn(response.data.message);
        } else {
          setFormData1(formData[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching details", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAccommodationButtonClick = (e) => {
    e.preventDefault();
    if (!formFilled) {
      toast.info(
        "Accommodation request cannot be made without completing the registration process. Kindly register first!"
      );
    } else if (!isVerified) {
      toast.info(
        "Thanks for registering! Kindly wait for the organizing committee to verify the payment against your registration, after which you will be able to proceed further."
      );
    } else if (!isStudent) {
      console.log("clicked");
      setShowAccommodationModal(true);
    } else {
      navigate("/accommodation");
    }
  };

  const handleAddToWaitingList = async (e) => {
    e.preventDefault();
    setShowAccommodationModal(false);
    try {
      const response = await axios.post(
        "https://regportal.onrender.com/accommodation/waiting-add",
        { token }
      );
      if (response.data.success === "true")
        toast.success(
          "Successfully added to the waiting list for Guest House rooms"
        );
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <div className="buttonscontainer">
        <button className="logoutbutton" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div
          className={`home-container${DarkMode ? "-dark" : ""} scroll`}
          style={{ height: height, textAlign: "center" }}
        >
          {!formFilled && !isVerified && (
            <h1
              style={{
                marginTop: "15vh",
                marginBottom: "20px",
                color: DarkMode ? "white" : "",
              }}
            >
              Welcome to the Home Page of the Registration Portal of IHMTC-2023
            </h1>
          )}
          {!formFilled && (
            <>
              <Link to="/registration" className="button">
                Fill the Registration form
              </Link>
            </>
          )}
          {isVerified && (
            <>
              <h1 style={{ color: DarkMode ? "white" : "" }}>
                {" "}
                Congratulations on completing your registration for IHMTC 2023!
              </h1>
              <h3 style={{ color: DarkMode ? "white" : "" }}>
                {" "}
                NOTE: Your registration for the IHMTC 2023 as per the details
                provided below has been verified and is now complete.
              </h3>
            </>
          )}

          {isAdmin && (
            <Link to="/users" className="button admin-button">
              Show Users
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/accommodationWaitingList"
              className="button admin-button"
            >
              Show waiting list
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/accommodationWaitingList"
              className="button admin-button"
            >
              Show accommodation waiting list
            </Link>
          )}

          {formFilled && !isVerified && (
            <div>
              <h1
                className="congrats"
                style={{ color: DarkMode ? "white" : "" }}
              >
                Thanks for filling the IHMTC 2023 registration form.
              </h1>
              <h3 style={{ color: DarkMode ? "white" : "" }}>
                <strong>NOTE:</strong> Your registration as per the details
                provided below is pending verification. The conference
                organizing committee after verifying payment status will send
                another confirmation email. Kindly contact the conference
                organizers at ihmtc2023@iitp.ac.in if you do not receive the
                confirmation email within next 3 working days.
              </h3>
            </div>
          )}
          {formFilled && formData1 && (
            <>
              <RegistrationDetailsVerif
                formData={formData1}
                isVerified={isVerified}
                DarkMode={DarkMode}
              />
              {!isVerified && (
                <FileDownload
                  isIshmtMember={formData1.isIshmtMember === "Yes"}
                  userId={formData1._id}
                  cv={cv}
                  isVerified={isVerified}
                  DarkMode={DarkMode}
                />
              )}
            </>
          )}
          <div>
            {(isStudent && !accommodationFormFilled) ||(!isStudent&&!isWaiting&&!accommodationFormFilled) && (
              <Link
                onClick={(e) => {
                  handleAccommodationButtonClick(e);
                }}
                className="button"
                style={{ backgroundColor: "orange" }}
              >
                Book Your Accommodation <br />
              </Link>
            )}
            {/* {(isStudent && !accommodationFormFilled) ||(!isStudent&&!isWaiting&&!accommodationFormFilled) && (
              <strong>
                Your name is on the Guest House waiting list. You'll receive an
                email with your allotted accommodation soon. Thank you for your
                patience.
              </strong>
            )} */}
            {accommodationFormFilled && !accommodationVerified && (
              <p>
                <strong>
                  Thank you for filling the accommodation form. <br /> Your
                  accommodation details are currently under verification.
                  <br /> You will receive an email when your details are
                  verified.
                  <br />
                  <br />
                </strong>
              </p>
            )}
            {accommodationVerified && (
              <p>
                Congratulations! Your accommodation details have been verified.
              </p>
            )}

            {!isStudent&&isWaiting&&(
              <p>
                Your name is on the Guest House waiting list. You'll receive an
              email with your allotted accommodation soon. Thank you for your
              patience.
              </p>
            )}

            
            {showAccommodationModal && (
              <div
                className="modal"
                style={{
                  color: DarkMode ? "white" : "",
                  backgroundColor: DarkMode ? "555" : "white",
                }}
              >
                <div className={`modal-content${DarkMode ? "-dark" : ""}`}>
                  <p>
                    Student hostel rooms are only available for booking
                    currently. Click OK to proceed. Otherwise, wait for the
                    organizing committee to open guest house rooms for bookings.
                    Your name has been added to the waiting list.
                  </p>
                  <button
                    onClick={(e) => {
                      handleAddToWaitingList(e);
                    }}
                  >
                    Wait for Guest house rooms
                  </button>
                  <button
                    onClick={() => {
                      setShowAccommodationModal(false);
                      navigate("/accommodation");
                    }}
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
            <p>
              For more information, please visit the{" "}
              <a
                className="link"
                href="https://ihmtc2023.iitp.ac.in/"
                style={{ color: "blue" }}
              >
                official website
              </a>
              .
            </p>
            <p>
              For inquiries, contact us at{" "}
              <a
                className="link"
                href="mailto:ihmtc2023@gmail.com"
                style={{ color: "blue" }}
              >
                ihmtc2023@gmail.com
              </a>
              <br />
              <br />
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
