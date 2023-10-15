import React, { useState } from "react";
import "./forgotPass.css";
import { useCookies } from "react-cookie";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
// import "bootstrap/dist/css/bootstrap.min.css";

const ForgotPass = (props) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [cookies, setCookies] = useCookies(["otp_token"]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const DarkMode = props.DarkMode;
  function isPasswordStrong(password) {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return passwordRegex.test(password);
  }

  const schema = yup.object().shape({
    newPassword: yup
      .string()
      .test("password-strength", "Password must be strong", (value) => {
        return isPasswordStrong(value);
      })
      .required("Password is required"),
    reEnterPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match")
      .required("Please repeat the password"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const lowerCaseEmail = email.toLowerCase();
    try {
      setLoading(true);
      const response = await axios.post(
        "https://regportal.onrender.com/forget-pass/sendotp",
        { email: lowerCaseEmail }
      );
      if (response.data.success === "true") {
        toast.success(response.data.message);
        setCookies("otp_token", response.data.otpToken);
        setStep(2);
      } else toast.error(response.data.message);
    } catch (error) {
      // console.log(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    const data = { userOTP: otp, otpToken: cookies.otp_token };
    try {
      const response = await axios.post(
        "https://regportal.onrender.com/forget-pass/verifyotp",
        data
      );

      if (response.data.success === "true") {
        toast.success(response.data.message);
        setCookies("otp_token", response.data.otpToken);
        setStep(3);
      } else toast.error(response.data.message);
    } catch (error) {
      toast.error(error);
      // console.log(error);
    }
  };

  const onSubmit = async (data) => {
    const data1 = { userEmail: email, newPassword: data.newPassword };
    try {
      const response = await axios.put(
        "https://regportal.onrender.com/forget-pass/changepass",
        data1
      );
      toast.success(response.data.message);
      if (response.data.success === "true") {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={`container${DarkMode ? "-dark" : ""}`}>
      {step === 1 && (
        <div
          style={{ width: "65%" }}
          className={`container${DarkMode ? "-dark" : ""}`}
        >
          <form
            onSubmit={handleEmailSubmit}
            className={`forgot${DarkMode ? "-dark" : ""}`}
          >
            <div className="mb-4">
              <label
                htmlFor="email"
                className={`block text-sm font-medium text-gray-700`}
                style={DarkMode ? { color: "white" } : {}}
              >
                Enter Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${DarkMode ? "input-dark" : ""}`}
                required
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
              >
                {loading ? <Loading color="white" /> : `Send OTP`}
              </button>
            </div>
          </form>
        </div>
      )}
      {step === 2 && (
        <div
          style={{ width: "65%" }}
          className={`container${DarkMode ? "-dark" : ""}`}
        >
          <form
            onSubmit={handleOTPSubmit}
            className={`forgot${DarkMode ? "-dark" : ""}`}
          >
            <div className="form-group">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="otp"
                style={DarkMode ? { color: "white" } : {}}
              >
                Enter OTP:{" "}
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                className={`${DarkMode ? "input-dark" : ""}`}
                required
              />
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
              >
                Change password
              </button>
            </div>
          </form>
        </div>
      )}
      {step === 3 && (
        <div
          style={{ width: "65%" }}
          className={`container${DarkMode ? "-dark" : ""}`}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`forgot${DarkMode ? "-dark" : ""}`}
          >
            <div className="form-group">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="newPassword"
                style={DarkMode ? { color: "white" } : {}}
              >
                Enter new password:
              </label>
              <input
                className={`${DarkMode ? "input-dark" : ""}`}
                type="password"
                id="newPassword"
                onChange={(e) => setNewPassword(e.target.value)}
                {...register("newPassword")}
                required
              />
              <p style={{ color: `red`, fontSize: `10px` }}>
                {errors.newPassword?.message}
              </p>

              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="reEnterPassword"
              >
                Re-Enter password:
              </label>
              <input
                type="password"
                id="reEnterPassword"
                onChange={(e) => setReEnterPassword(e.target.value)}
                {...register("reEnterPassword")}
                className={`${DarkMode ? "input-dark" : ""}`}
                required
              />
              <p style={{ color: `red`, fontSize: `10px` }}>
                {errors.reEnterPassword?.message}
              </p>
            </div>

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

            <div className="form-group">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ForgotPass;
