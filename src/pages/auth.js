import "./auth.css";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Auth = (props) => {
  const [mode, setMode] = useState(true);
  const isDarkMode = props.DarkMode;
  const switchToLoginMode = async () => {
    setMode(true);
  };

  const [colorIndex, setColorIndex] = useState(0);
  const colors = ["#3498db", "#e74c3c", "#2ecc71"]; // Example colors

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((colorIndex + 1) % colors.length);
    }, 1500); // Change color every 3 seconds

    return () => clearInterval(interval); // Clear the interval on component unmount
  }, [colorIndex, colors.length]);

  const messageStyles = {
    fontSize: "40px",
    fontWeight: "700",
    padding: "20px",
    textAlign: "center",
    borderRadius: "10px",
    margin: "20px auto",
  };

  return (
    <div className={`authWrapper${isDarkMode ? "-dark" : ""}`}>
      <div
        className="welcomeMessage"
        style={{ color: colors[colorIndex], textAlign: "center" }}
      >
        <p style={messageStyles}>Welcome to IHMTC 2023 Registrations!!!</p>
      </div>
      <h1 style={{ fontWeight: "700" }}>IHMTC Registration Portal</h1>
      <div className={`authCard${isDarkMode ? "-dark" : ""} scroll`}>
        <div className="authMode">
          <h3
            className={`loginMode${isDarkMode ? "-dark" : ""} ${
              mode ? "active" : ""
            }`}
            onClick={() => setMode(true)}
          >
            Login
          </h3>
          <h3
            className={`signinMode${isDarkMode ? "-dark" : ""} ${
              !mode ? "active" : ""
            }`}
            onClick={() => setMode(false)}
          >
            Sign Up
          </h3>
        </div>
        {mode ? (
          <LoginForm DarkMode={isDarkMode} />
        ) : (
          <SignUpForm
            DarkMode={isDarkMode}
            switchToLoginMode={switchToLoginMode}
          />
        )}
      </div>
    </div>
  );
};
export default Auth;

const LoginForm = (props) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [, setCookies] = useCookies(["access_token"]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const DarkMode = props.DarkMode;
  const schema = yup.object().shape({
    userEmail: yup.string().email().required("Email is required"),
    userPassword: yup
      .string()
      .min(3)
      .required("Password must be at least 3 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const temp = data.userEmail;
      data.userEmail = temp.toLowerCase();
      const response = await axios.post(
        "https://regportal.onrender.com/auth/login",
        data
      );
      if (response.data.success === "false")
        toast.error(
          "Invalid Email-id or passsword. Please double-check your credentials."
        );
      if (response.data.userID) {
        toast.success("Login Successful");
        setCookies("access_token", response.data.token);
        window.localStorage.setItem("userID", response.data.userID);
        navigate("/home");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  let content = null;
  if (loading) content = <Loading />;
  else {
    content = (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`authForm${DarkMode ? "-dark" : ""}`}
      >
        <label
          className={`${DarkMode ? "label-dark" : ""}`}
          htmlFor="useremail"
        >
          Email ID:
        </label>
        <input
          className={`${DarkMode ? "input-dark" : ""}`}
          type="email"
          placeholder="Email"
          id="useremail"
          onChange={(e) => setUserEmail(e.target.value.toLowerCase())}
          {...register("userEmail")}
        />
        <p style={{ color: `red`, fontSize: `10px` }}>
          {errors.userEmail?.message}
        </p>

        <span
          htmlFor="userpassword"
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
          }}
        >
          Password:{" "}
          {!show ? (
            <VisibilityOffIcon
              style={{
                cursor: "pointer",
                position: "relative",
                bottom: "-5vh",
                left: "-1vh",
                opacity: "80%",
              }}
              onClick={(e) => {
                e.preventDefault();
                setShow(true);
              }}
            />
          ) : (
            <VisibilityIcon
              style={{
                cursor: "pointer",
                position: "relative",
                bottom: "-5vh",
                left: "-1vh",
                opacity: "80%",
              }}
              onClick={(e) => {
                e.preventDefault();
                setShow(false);
              }}
            />
          )}
        </span>
        <input
          className={`${DarkMode ? "input-dark" : ""}`}
          type={show ? "text" : "password"}
          placeholder="Password"
          id="userpassword"
          onChange={(e) => setUserPassword(e.target.value)}
          {...register("userPassword")}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
          }}
        ></div>
        <p style={{ color: `red`, fontSize: `10px` }}>
          {errors.userPassword?.message}
        </p>

        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
          <Link className="forgot-password-link" to="/forgotPass">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          // style={buttonStyle}
          // onMouseEnter={handleMouseEnter}
          // onMouseLeave={handleMouseLeave}
          style={{ backgroundColor: "#007bff", color: "white" }}
          // style={{ backgroundColor: "blue", color: "white" }}
          onClick={handleSubmit}
        >
          {loading ? <Loading /> : "Log in"}
        </button>
      </form>
    );
  }
  return content;
};

const SignUpForm = (props) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [human, setHuman] = useState(false);
  const [show, setShow] = useState(false);
  const [showc, setShowc] = useState(false);
  // const buttonStyle = {
  //   backgroundColor: "blue",
  //   transition: "background-color 0.3s", // Add a smooth transition effect
  // };
  const DarkMode = props.DarkMode;

  function isPasswordStrong(password) {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return passwordRegex.test(password);
  }

  const schema = yup.object().shape({
    userEmail: yup.string().email().required("Email is required"),
    userPassword: yup
      .string()
      .test("password-strength", "Password must be strong", (value) => {
        return isPasswordStrong(value);
      })
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("userPassword"), null], "Passwords must match")
      .required("Please repeat the password"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const temp = data.userEmail;
      data.userEmail = temp.toLowerCase();
      const response = await axios.post(
        "https://regportal.onrender.com/auth/signUp",
        data
      );
      // console.log(response);
      if (response.data.success === "true") {
        toast.success(response.data.message);
        await props.switchToLoginMode();
      } else {
        toast.error(response.data.message);
        setHuman(false);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  let content = null;
  if (loading) content = <Loading />;
  else {
    content = (
      <form onSubmit={handleSubmit(onSubmit)} className="authForm">
        <label htmlFor="useremail">Email ID:</label>
        <input className={`${DarkMode ? "input-dark" : ""}`}
          type="email"
          placeholder="Email"
          id="useremail"
          onChange={(e) => setUserEmail(e.target.value.toLowerCase())}
          {...register("userEmail")}
        />
        <p style={{ color: `red`, fontSize: `10px` }}>
          {errors.userEmail?.message}
        </p>
        <span
          htmlFor="userpassword"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          Password:{" "}
          {!show ? (
            <VisibilityOffIcon
              style={{
                cursor: "pointer",
                position: "relative",
                bottom: "-5vh",
                left: "-1vh",
                opacity: "80%",
              }}
              onClick={(e) => {
                e.preventDefault();
                setShow(true);
              }}
            />
          ) : (
            <VisibilityIcon
              style={{
                cursor: "pointer",
                position: "relative",
                bottom: "-5vh",
                left: "-1vh",
                opacity: "80%",
              }}
              onClick={(e) => {
                e.preventDefault();
                setShow(false);
              }}
            />
          )}
        </span>
        <input className={`${DarkMode ? "input-dark" : ""}`}
          type={show ? "text" : "password"}
          placeholder="Password"
          id="userpassword"
          onChange={(e) => setUserPassword(e.target.value)}
          {...register("userPassword")}
        />
        <p style={{ color: `red`, fontSize: `10px` }}>
          {errors.userPassword?.message}
        </p>
        <span
          htmlFor="confirmpassword"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          Confirm Password:{" "}
          {!showc ? (
            <VisibilityOffIcon
              style={{
                cursor: "pointer",
                position: "relative",
                bottom: "-5vh",
                left: "-1vh",
                opacity: "80%",
              }}
              onClick={(e) => {
                e.preventDefault();
                setShowc(true);
              }}
            />
          ) : (
            <VisibilityIcon
              style={{
                cursor: "pointer",
                position: "relative",
                bottom: "-5vh",
                left: "-1vh",
                opacity: "80%",
              }}
              onClick={(e) => {
                e.preventDefault();
                setShowc(false);
              }}
            />
          )}
        </span>
        <input className={`${DarkMode ? "input-dark" : ""}`}
          type={showc ? "text" : "password"}
          placeholder="Confirm Password"
          id="confirmPassword"
          onChange={(e) => setconfirmPassword(e.target.value)}
          {...register("confirmPassword")}
        />
        <p style={{ color: `red`, fontSize: `10px` }}>
          {errors.confirmPassword?.message}
        </p>
        <div className="password-criteria">
          <p className="password-criteria-text">Password Requirements:</p>
          <ul className="password-criteria-list">
            <li>Minimum 8 characters</li>
            <li>At least one uppercase letter</li>
            <li>At least one lowercase letter</li>
            <li>At least one digit</li>
            <li>At least one special character (e.g., !@#$%^&*)</li>
          </ul>
        </div>
        <div className="captcha">
          <ReCAPTCHA
            sitekey="6Lcruw8oAAAAADDlFSO-1u6GfiXPjlKSeP5cv8bM"
            style={{ textAlign: "-webkit-center", padding: "10px 10px" }}
            onChange={() => {
              setHuman(!human);
            }}
          />
        </div>
        <button
          type="submit"
          disabled={!human}
          style={{ backgroundColor: "#007bff", color: "white" }}
          onClick={handleSubmit}
        >
          {loading ? <Loading /> : "Sign Up"}
        </button>
      </form>
    );
  }
  return content;
};
