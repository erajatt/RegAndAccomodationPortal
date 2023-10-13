import React from "react";
import "./buttons.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
            <button className="back-button" onClick={handleGoBack}>
                Back
            </button>
            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default Buttons;
