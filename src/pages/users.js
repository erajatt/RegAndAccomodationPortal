import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import "./users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isAdmin, setAdmin] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [cookieValue, setCookieValue] = useState("");
  const [loadingEx, setLoadingEx] = useState(false);
  const [loadingPf, setLoadingPf] = useState(false);
  const [loadingIf, setLoadingIf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userCount, setUserCount] = useState(0);


  const fetchUserData = async (token) => {
    try {
      // setLoadingVisible(true);
      const response = await axios.post(
        "https://regportal.onrender.com/admin/user-list",
        { token }
      );
      if (response.data.success === "true") {
        setUsers(response.data.list);
      } else {
        // console.log(response);
      }
    } catch (error) {
      // console.log(error);
      toast.error(error);
    }
    // setLoadingVisible(false);
  };

  const filterUsers = useCallback(() => {
    const filtered = users.filter((user) =>
      user.userEmail.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchInput]);

  useEffect(() => {
    filterUsers();
    setUserCount(filteredUsers.length);
  }, [filterUsers, filteredUsers]);
  

  useEffect(() => {
    const cookie = document.cookie;
    const cookieArray = cookie.split("; ");
    const desiredCookie = cookieArray.find((item) =>
      item.startsWith("access_token=")
    );

    if (desiredCookie) {
      const cookieValue = desiredCookie.split("=")[1];
      setValues(cookieValue);
      fetchUserData(cookieValue);
    }
  }, []);

  const setValues = async (token) => {
    const response = await axios.post(
      "https://regportal.onrender.com/auth/userAccess",
      {
        token,
      }
    );
    setAdmin(response.data.isAdmin);
    setCookieValue(token);
  };

  const handleDeleteUser = async (userID) => {
    const response = await axios.delete(
      `https://regportal.onrender.com/admin/delete`,
      {
        data: { userID: userID, token: cookieValue },
      }
    );
    // console.log(response);
    toast.success(response.data.message);
    if (response.data.success === "true") {
      setUsers(response.data.list);
    }
  };

  const handleVerifyUser = async (userID) => {
    const confirmed = window.confirm(
      "Do you want to verify and send an email to the user?"
    );
    if (confirmed) {
      const response = await axios.post(
        "https://regportal.onrender.com/admin/changeVerified",
        {
          userID: userID,
          token: cookieValue,
        }
      );
      // console.log(response);
      fetchUserData(cookieValue);
      // console.log(response.data);
      if (response.data.success !== "true") {
        toast.error(response.data);
      } else if (response.data.isVerified === true) {
        try {
          const response = await axios.post(
            "https://regportal.onrender.com/admin/sendVerificationEmail",
            {
              userID: userID,
              token: cookieValue,
            }
          );
          // console.log(response);
          if (response.data.success === "true")
            toast.success("Email has been sent successfully.");
          else toast.error("Failed to send email to the user.");
        } catch (error) {
          console.error("Error sending email:", error);
          toast.error("Failed to send email to the user.");
        }
      }
    }
  };

  const handleVerifyUserAccommodation = async (userID) => {
    const confirmed = window.confirm(
      "Do you want to verify the user's accommodation and send an email to the user?"
    );
    if (confirmed) {
      const response = await axios.post(
        "https://regportal.onrender.com/admin/changeVerified",
        {
          userID: userID,
          token: cookieValue,
        }
      );
      // console.log(response);
      fetchUserData(cookieValue);
      // console.log(response.data);
      if (response.data.success !== "true") {
        toast.error(response.data);
      } else if (response.data.isAccommodationVerified === true) {
        try {
          const response = await axios.post(
            "https://regportal.onrender.com/admin/sendVerificationEmail",
            {
              userID: userID,
              token: cookieValue,
            }
          );
          // console.log(response);
          if (response.data.success === "true")
            toast.success("Email has been sent successfully.");
          else toast.error("Failed to send email to the user.");
        } catch (error) {
          console.error("Error sending email:", error);
          toast.error("Failed to send email to the user.");
        }
      }
    }
  };

  const handleDownloadAllUsers = async () => {
    try {
      setLoadingEx(true);
      const response = await axios.post(
        "https://regportal.onrender.com/admin/download",
        { token: cookieValue }
      );
      // console.log(response);

      let allUsersData = response.data.usersData;
      allUsersData.map((data) => {
        data.whatsappNumber = `https://wa.me/${data.whatsappNumberCode}${data.whatsappNumber}`;
        data.fee = parseFloat(data.fee);
        return data;
      });

      const worksheet = XLSX.utils.json_to_sheet(allUsersData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "All Users Data");
      const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "all_users_data.xlsx");
    } catch (error) {
      // console.log(error);
      toast.error(error);
    } finally {
      setLoadingEx(false);
    }
  };

  const handleDownloadISHMTID = async (userID) => {
    axios({
      url: `https://regportal.onrender.com/admin/userIshmtIDFile`,
      method: "POST",
      responseType: "blob", // Set the response type to blob for binary data
      data: { userID: userID, token: cookieValue },
    })
      .then((response) => {
        handleLoadingStateChange(userID, "downloadISHMTID", true);
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
        toast.error("File Not Found");
      })
      .finally(() =>
        handleLoadingStateChange(userID, "downloadISHMTID", false)
      );
  };

  const handleDownloadReceipt = async (userID) => {
    axios({
      url: `https://regportal.onrender.com/admin/userPaymentFile`,
      method: "POST",
      responseType: "blob", // Set the response type to blob for binary data
      data: { userID: userID, token: cookieValue },
    })
      .then((response) => {
        // Create a URL for the blob data
        handleLoadingStateChange(userID, "downloadPaymentReciept", true);
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
      .finally(() =>
        handleLoadingStateChange(userID, "downloadPaymentReciept", false)
      );
  };

  const handleDownloadUserData = async (userID) => {
    axios({
      url: `https://regportal.onrender.com/admin/userFormDetail`,
      method: "POST",
      responseType: "json", // Set the response type to JSON
      data: { userID: userID, token: cookieValue },
    })
      .then((response) => {
        // Extract the formData attribute from the JSON response
        setLoading(true);
        const formData = response.data.formData;

        const success = response.data.success;
        if (success === "false") {
          toast.warn(response.data.message);
        } else {
          // Create a container div for the customized content
          const container = document.createElement("div");
          container.className = "container";

          // Create the customized HTML content
          container.innerHTML = `
          <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          h3 {
            color: #333;
          }
          p {
            margin: 0;
            padding: 0;
            margin-bottom: 10px;
          }
          strong {
            color: #333;
          }
          .container {
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          }
        </style>
        <div className="container">
      <h3>Conference Registration Details</h3>
      <p><strong>First Name:</strong> ${formData?.firstName}</p>
       ${
         formData?.middleName
           ? `<p><strong>Middle Name:</strong>${formData?.middleName}</p>`
           : ""
       }
       ${
         formData?.lastName
           ? `<p><strong>Last Name:</strong>${formData?.lastName}</p>`
           : ""
       }
      <p><strong>Honorific:</strong> ${formData?.honorific}</p>
      <p><strong>Gender:</strong> ${formData?.gender}</p>
      <p><strong>Year of Birth:</strong> ${formData?.birthYear}</p>
      <p><strong>Primary Affiliation:</strong> ${
        formData?.primaryAffiliation
      }</p>
      <p><strong>Country:</strong> ${formData?.country}</p>
      <p><strong>Email:</strong> ${formData?.email}</p>
      <p><strong>Contact Number:</strong> ${formData?.contactNumberCode}-${
            formData?.contactNumber
          }</p>
      ${
        formData?.whatsappNumberCode
          ? `<p><strong>WhatsApp Number:</strong> ${formData?.whatsappNumberCode}-${formData?.whatsappNumber} </p>`
          : ""
      }
      <p><strong>Number of Papers:</strong> ${formData?.paperCount}</p>
      ${
        formData?.paperCount === "1" || formData?.paperCount === "2"
          ? `<p><strong>Submission ID of Paper #1:</strong> ${formData?.paper1Id}</p>`
          : ""
      }
      ${
        formData?.paperCount === "2"
          ? `<p><strong>Submission ID of Paper #2:</strong> ${formData?.paper2Id}</p>`
          : ""
      }
      <p><strong>Profile:</strong> ${formData?.profile}</p>
      <p><strong>Accompanying Persons:</strong> ${
        formData?.accompanyingPersons
      }</p>
      <p><strong>Is ISHMT Member? :</strong> ${formData?.isIshmtMember}</p>
      ${
        formData?.isIshmtMember === "Yes"
          ? `<p><strong>ISHMT ID Number:</strong> ${formData?.ishmtIDno}</p>`
          : ""
      }
      <p><strong>Payment Reference Number:</strong> ${
        formData?.paymentReferenceNumber
      }</p>
      <p><strong>Category:</strong> ${formData?.category}</p>
      <p><strong>Amount Paid:</strong> ₹ ${formData?.fee}.00</p>
       ${
         formData?.comment
           ? `<p><strong>Comment:</strong></p> ${formData?.comment}`
           : ""
       }
  <p>For more information, please visit the <a className="link" href="https://ihmtc2023.iitp.ac.in/">official website</a>.</p>
  <p>For inquiries, contact us at <a className="link" href="mailto:ihmtc2023@gmail.com">ihmtc2023@gmail.com</a></p>
  <p className="verification-msg">We are currently verifying your registration details. You will be notified once your submitted data is verified.</p>
</div>`;

          // Open the customized content in a new tab
          const newTab = window.open("", "_blank");
          if (newTab) {
            newTab.document.body.appendChild(container);
            newTab.focus();
          } else {
            console.error("Could not open new tab.");
          }
        }
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
        toast.warn("File Not Found");
      })
      .finally(() => setLoading(false));
  };

  const downloadAllISHMTID = async () => {
    axios({
      url: `https://regportal.onrender.com/admin/IshmtIDFiles`,
      method: "POST",
      responseType: "blob", // Set the response type to blob for binary data
      data: { token: cookieValue },
    })
      .then((response) => {
        // Create a URL for the blob data
        setLoadingIf(true);
        const blobUrl = URL.createObjectURL(response.data);
        // console.log(response.headers);
        // Create a link element for downloading
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
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      })
      .finally(() => setLoadingIf(false));
  };

  const downloadAllReceipts = async () => {
    axios({
      url: `https://regportal.onrender.com/admin/PaymentFiles`,
      method: "POST",
      responseType: "blob", // Set the response type to blob for binary data
      data: { token: cookieValue },
    })
      .then((response) => {
        // Create a URL for the blob data
        setLoadingPf(true);
        const blobUrl = URL.createObjectURL(response.data);
        // console.log(response.headers);
        // Create a link element for downloading
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
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      })
      .finally(() => setLoadingPf(false));
  };

  const [loadingStates, setLoadingStates] = useState({});

  const handleLoadingStateChange = (userId, action, isLoading) => {
    setLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [userId]: {
        ...prevLoadingStates[userId],
        [action]: isLoading,
      },
    }));
  };

  return (
    isAdmin && (
      <div className="userscontainer">
        <h2>User Management</h2>
        <div className="user-count">Total Registered Users: {userCount}</div>
        <input
          type="text"
          placeholder="Search by Email"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <button
            className="download-all-button"
            disabled={loadingEx}
            onClick={() => {
              setLoadingEx(true);
              handleDownloadAllUsers();
            }}
          >
            {loadingEx ? (
              <Loading
                color={"#fff"}
                height={"20%"}
                width={"20%"}
                divHeight={"20px"}
                divWidth={"128px"}
              />
            ) : (
              "Download All Users Data"
            )}
          </button>

          <button
            className="download-all-button"
            disabled={loadingIf}
            onClick={() => {
              setLoadingIf(true);
              downloadAllISHMTID();
            }}
          >
            {loadingIf ? (
              <Loading
                color={"#fff"}
                height={"20%"}
                width={"20%"}
                divHeight={"20px"}
                divWidth={"128px"}
              />
            ) : (
              "Download All ISHMT ID Files (ZIP)"
            )}
          </button>

          <button
            className="download-all-button"
            disabled={loadingPf}
            onClick={() => {
              setLoadingPf(true);
              downloadAllReceipts();
            }}
          >
            {loadingPf ? (
              <Loading
                color={"#fff"}
                height={"20%"}
                width={"20%"}
                divHeight={"20px"}
                divWidth={"128px"}
              />
            ) : (
              "Download All Payment Receipts (ZIP)"
            )}
          </button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Verify Registration</th>
                <th>Email</th>
                <th>Verify Accommodation</th>
                <th>ISHMT ID</th>
                <th>Payment Receipt</th>
                <th>User Data</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={user.isVerified}
                      onClick={() => {
                        handleVerifyUser(user._id);
                      }}
                      className={user.isVerified ? "" : "enabled-cursor"}
                      disabled={user.isVerified}
                    />
                  </td>
                  <td>{user.userEmail}</td>
                  <td>
                    {user.isAccommodationFormFilled ? (
                      <input
                        type="checkbox"
                        checked={user.isAccommodationVerified}
                        onClick={() => {
                          handleVerifyUserAccommodation(user._id);
                        }}
                        className={
                          user.isAccommodationVerified ? "" : "enabled-cursor"
                        }
                        disabled={user.isAccommodationVerified}
                      />
                    ) : null}
                  </td>

                  <td>
                    <button
                      className="download1-button"
                      disabled={loadingStates[user._id]?.downloadISHMTID}
                      onClick={() => {
                        handleLoadingStateChange(
                          user._id,
                          "downloadISHMTID",
                          true
                        );
                        handleDownloadISHMTID(user._id);
                      }}
                    >
                      {loadingStates[user._id]?.downloadISHMTID ? (
                        <Loading
                          color={"#fff"}
                          height={"40%"}
                          width={"40%"}
                          divHeight={"25px"}
                          divWidth={"75px"}
                        />
                      ) : (
                        "Download"
                      )}
                    </button>
                  </td>
                  <td>
                    <button
                      className="download-button"
                      onClick={() => {
                        handleLoadingStateChange(
                          user._id,
                          "downloadPaymentReciept",
                          true
                        );
                        handleDownloadReceipt(user._id);
                      }}
                      disabled={loadingStates[user._id]?.downloadPaymentReciept}
                    >
                      {" "}
                      {loadingStates[user._id]?.downloadPaymentReciept ? (
                        <Loading
                          color={"#fff"}
                          height={"40%"}
                          width={"40%"}
                          divHeight={"25px"}
                          divWidth={"75px"}
                        />
                      ) : (
                        "Download"
                      )}
                    </button>
                  </td>
                  <td>
                    <button
                      className="view-button"
                      onClick={() => handleDownloadUserData(user._id)}
                    >
                      View
                    </button>
                  </td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  );
};

export default Users;
