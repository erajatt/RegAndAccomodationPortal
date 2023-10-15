import React, { useState } from "react";
// import "./RegistrationDetails.css";
import axios from "axios";
import "./FileDownload.css";
import Loading from "./Loading";
import { toast } from "react-toastify";
import VerificationBadge from "./verificationBadge";
import DownloadForOfflineOutlined from "@mui/icons-material/DownloadForOfflineOutlined";

const FileDownload = ({ isIshmtMember, userId, cv, isVerified, DarkMode }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [loadingP, setLoadingP] = useState(false);
  const [loadingI, setLoadingI] = useState(false);
  const downloadIshmtFile = async () => {
    axios({
      url: `https://regportal.onrender.com/auth/ishmtID`,
      method: "POST",
      responseType: "blob", // Set the response type to blob for binary data
      data: { token: cv },
    })
      .then((response) => {
        // setLoadingI(true);
        // Create a URL for the blob data
        if (response.data.success === "false")
          toast.warn(response.data.message);
        const blobUrl = URL.createObjectURL(response.data);

        // Create a link element for downloading
        const success = response.data.success;
        // console.log(success);
        if (success === "false") {
          toast.warn(response.data.message);
        } else {
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = response.headers["content-disposition"].split("=")[1];
          link.target = "_blank";

          // Trigger a click on the link to start the download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Revoke the blob URL to release memory
          URL.revokeObjectURL(blobUrl);
        }
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
        toast.error("Some error occured");
      })
      .finally(() => setLoadingI(false));
  };

  const downloadPaymentFile = async () => {
    axios({
      url: `https://regportal.onrender.com/auth/paymentReciept`,
      method: "POST",
      responseType: "blob", // Set the response type to blob for binary data
      data: { token: cv },
    })
      .then((response) => {
        // Create a URL for the blob data
        setLoadingP(true);
        const blobUrl = URL.createObjectURL(response.data);
        // console.log(response.headers);
        // Create a link element for downloading
        const success = response.data.success;
        if (success === "false") {
          toast.warn(response.data.message);
        } else {
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = response.headers["content-disposition"].split("=")[1];
          link.target = "_blank";

          // Trigger a click on the link to start the download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Revoke the blob URL to release memory
          URL.revokeObjectURL(blobUrl);
        }
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
        toast.warn("File Not Found");
      })
      .finally(() => setLoadingP(false));
  };

  return (
    <div className={`fee-breakdown${DarkMode ? "-dark" : ""} table${DarkMode ? "-dark" : ""}`}>
      <div
        className="fee-header"
        style={DarkMode ? { color: "white" } : {}}
        onClick={toggleDropdown}
      >
        Download Files{" "}
        <span
          style={DarkMode ? { color: "white" } : {}}
          className={`dropdown-icon ${isDropdownOpen ? "open" : ""}`}
        >
          ▼
        </span>
      </div>
      {isDropdownOpen && (
        <div className="container1">
          {isIshmtMember ? (
            <>
              <button
                disabled={loadingI}
                className="download1-button"
                onClick={() => {
                  setLoadingI(true);
                  downloadIshmtFile(userId);
                }}
              >
                {loadingI ? (
                  <Loading
                    color={"#fff"}
                    height={"20%"}
                    width={"20%"}
                    divHeight={"20px"}
                    divWidth={"128px"}
                  />
                ) : (
                  <span>
                    Download ISHMT Member ID file <DownloadForOfflineOutlined />
                  </span>
                )}
              </button>
              <VerificationBadge isVerified={isVerified} />
              <br />
              <button
                className="download-button"
                disabled={loadingP}
                onClick={() => {
                  setLoadingP(true);
                  downloadPaymentFile(userId);
                }}
              >
                {loadingP ? (
                  <Loading
                    color={"#fff"}
                    height={"20%"}
                    width={"20%"}
                    divHeight={"20px"}
                    divWidth={"128px"}
                  />
                ) : (
                  <span>
                    Download Payment Receipt File <DownloadForOfflineOutlined />
                  </span>
                )}
              </button>
              <VerificationBadge isVerified={isVerified} />
            </>
          ) : (
            <>
              <button
                disabled={loadingP}
                className="download-button"
                onClick={() => {
                  setLoadingP(true);
                  downloadPaymentFile(userId);
                }}
              >
                {loadingP ? (
                  <Loading
                    color={"#fff"}
                    height={"20%"}
                    width={"20%"}
                    divHeight={"20px"}
                    divWidth={"128px"}
                  />
                ) : (
                  <span>
                    Download Payment Receipt File <DownloadForOfflineOutlined />
                  </span>
                )}
              </button>
              <VerificationBadge isVerified={isVerified} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FileDownload;
