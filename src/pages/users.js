import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import "./users.css";

const Users = (props) => {
  const [users, setUsers] = useState([]);
  const [isAdmin, setAdmin] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [cookieValue, setCookieValue] = useState("");
  const [loadingEx, setLoadingEx] = useState(false);
  const [loadingPf, setLoadingPf] = useState(false);
  const [loadingIf, setLoadingIf] = useState(false);
  const [loadingAf, setLoadingAf] = useState(false);
  const [loading, setLoading] = useState(false);
  const DarkMode = props.DarkMode;

  const fetchUserData = async (token) => {
    const response = await axios.post(
      "https://regportal.onrender.com/admin/user-list",
      { token }
    );
    if (response.data.success === "true") {
      setUsers(response.data.list);
    }
  };

  useEffect(() => {
    const cookie = document.cookie;
    const cookieArray = cookie.split("; ");
    const desiredCookie = cookieArray.find((item) =>
      item.startsWith("access_token=")
    );

    if (desiredCookie) {
      const cookieVal = desiredCookie.split("=")[1];
      setValues(cookieVal);
      fetchUserData(cookieVal);
      setCookieValue(cookieVal);
    }
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.userEmail.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchInput]);

  const setValues = async (token) => {
    const response = await axios.post(
      "https://regportal.onrender.com/auth/userAccess",
      {
        token,
      }
    );
    setAdmin(response.data.isAdmin);
  };

  const handleDeleteUser = async (userID) => {
    const confirmed = window.confirm(
      "Do you want to delete the user's profile from the database?"
    );
    if (confirmed) {
      try {
        const response = await axios.delete(
          `https://regportal.onrender.com/admin/userDelete`,
          {
            data: { userID: userID, token: cookieValue },
          }
        );
        if (response.data.success === "true") {
          toast.success("User deleted succesfully!");
          setUsers(response.data.list);
        } else {
          toast.error("Failed to delete the user. Please try again.");
        }
      } catch (error) {
        toast.error("Failed to delete the user. Please try again.");
      }
    }
  };

  const handleDeleteUserAccommodation = async (userID) => {
    const confirmed = window.confirm(
      "Do you want to delete the user's accomodation details from the database?"
    );
    if (confirmed) {
      try {
        const response = await axios.delete(
          `https://regportal.onrender.com/admin/userAccommodationDelete`,
          {
            data: { userID: userID, token: cookieValue },
          }
        );
        if (response.data.success === "true") {
          toast.success("User's accommodation deleted succesfully!");
          setUsers(response.data.list);
        } else {
          toast.error(
            "Failed to delete the user's accommodation. Please try again."
          );
        }
      } catch (error) {
        toast.error(
          "Failed to delete the user's accommodation. Please try again."
        );
      }
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

      if (response.data.success !== "true") {
        toast.error("Failed to verify the user.");
      } else if (response.data.isVerified === true) {
        fetchUserData(cookieValue);
        try {
          const response = await axios.post(
            "https://regportal.onrender.com/admin/sendVerificationEmail",
            {
              userID: userID,
              token: cookieValue,
            }
          );
          if (response.data.success === "true")
            toast.success(
              "User is verified and email has been sent successfully."
            );
          else toast.error("Failed to send verification email to the user.");
        } catch (error) {
          toast.error("Failed to send verification email to the user.");
        }
      }
    }
  };

  const handleVerifyUserAccommodation = async (userID) => {
    const confirmed = window.confirm(
      "Do you want to verify the user's accommodation and send an email to the user?"
    );
    if (confirmed) {
      try {
        const response = await axios.put(
          "https://regportal.onrender.com/accommodation/verification",
          {
            userID: userID,
            token: cookieValue,
          }
        );
        if (response.data.success === "true") {
          fetchUserData(cookieValue);
          toast.success(
            "User accommodation has been verified and email has been sent successfully."
          );
        } else
          toast.error(
            "Failed to verify the user's accommodation. Please try again."
          );
      } catch (error) {
        toast.error(
          "Failed to verify the user's accommodation. Please try again."
        );
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
      toast.error(error);
    } finally {
      setLoadingEx(false);
    }
  };

  const handleDownloadISHMTID = async (userID) => {
    axios({
      url: `https://regportal.onrender.com/admin/userIshmtIDFile`,
      method: "POST",
      responseType: "blob",
      data: { userID: userID, token: cookieValue },
    })
      .then((response) => {
        handleLoadingStateChange(userID, "downloadISHMTID", true);
        if (response.data.success === "false")
          toast.warn(response.data.message);
        const blobUrl = URL.createObjectURL(response.data);

        if (response.data.success === "false") {
          toast.warn(response.data.message);
        } else {
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = response.headers["content-disposition"].split("=")[1];
          link.target = "_blank";

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

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

  const handleDownloadUserData = async (userID) => {
    axios({
      url: `https://regportal.onrender.com/admin/userFormDetail`,
      method: "POST",
      responseType: "json",
      data: { userID: userID, token: cookieValue },
    })
      .then((response) => {
        setLoading(true);
        const formData = response.data.formData;

        const success = response.data.success;
        if (success === "false") {
          toast.warn(response.data.message);
        } else {
          const container = document.createElement("div");
          container.className = "container";
          container.innerHTML = `
          <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: ${DarkMode ? "#555" : "#f4f4f4"};
            color: ${DarkMode ? "white" : "black"};
          }
          h3 {
            color: ${DarkMode ? "white" : "black"};
          }
          p {
            margin: 0;
            padding: 0;
            margin-bottom: 10px;
          }
          strong {
            color: ${DarkMode ? "white" : "black"};
          }
          .container {
            padding: 20px;
            background-color: ${DarkMode ? "#555" : "#f4f4f4"};
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
        setLoadingIf(true);
        const blobUrl = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = response.headers["content-disposition"].split("=")[1];
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
      responseType: "blob",
      data: { token: cookieValue },
    })
      .then((response) => {
        setLoadingPf(true);
        const blobUrl = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = response.headers["content-disposition"].split("=")[1];
        link.target = "_blank";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      })
      .finally(() => setLoadingPf(false));
  };

  const downloadAllAccommodationReceipts = async () => {
    axios({
      url: `https://regportal.onrender.com/admin/accommodationPaymentFiles`,
      method: "POST",
      responseType: "blob",
      data: { token: cookieValue },
    })
      .then((response) => {
        setLoadingAf(true);
        const blobUrl = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = response.headers["content-disposition"].split("=")[1];
        link.target = "_blank";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        toast.error("Error downloading files", error);
      })
      .finally(() => setLoadingAf(false));
  };

  const handleDownloadReceipt = async (userID) => {
    axios({
      url: `https://regportal.onrender.com/admin/userPaymentFile`,
      method: "POST",
      responseType: "blob",
      data: { userID: userID, token: cookieValue },
    })
      .then((response) => {
        handleLoadingStateChange(userID, "downloadPaymentReciept", true);
        const blobUrl = URL.createObjectURL(response.data);
        const success = response.data.success;
        if (success === "false") {
          toast.warn(response.data.message);
        } else {
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = response.headers["content-disposition"].split("=")[1];
          link.target = "_blank";

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

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

  const handleDownloadAccommodationReceipt = async (userID) => {
    axios({
      url: `https://regportal.onrender.com/admin/userAccommodationPaymentFile`,
      method: "POST",
      responseType: "blob",
      data: { userID: userID, token: cookieValue },
    })
      .then((response) => {
        handleLoadingStateChange(userID, "downloadAccommodationReciept", true);
        const blobUrl = URL.createObjectURL(response.data);
        const success = response.data.success;
        if (success === "false") {
          toast.warn(response.data.message);
        } else {
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = response.headers["content-disposition"].split("=")[1];
          link.target = "_blank";

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          URL.revokeObjectURL(blobUrl);
        }
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
        toast.warn("File Not Found");
      })
      .finally(() =>
        handleLoadingStateChange(userID, "downloadAccommodationReciept", false)
      );
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
      <div className={`userscontainer${DarkMode ? "-dark" : ""}`}>
        <h2>User Management</h2>
        <div className={`user-count${DarkMode ? "-dark" : ""}`}>
          {searchInput === ""
            ? `Number of users registered (pending verification): ${
                users.filter((user) => !user.isVerified).length
              }`
            : `Number of users registered (pending verification): ${
                filteredUsers.filter((user) => !user.isVerified).length
              }`}
        </div>
        <div className={`user-count${DarkMode ? "-dark" : ""}`}>
          {searchInput === ""
            ? `Number of users registered (verified): ${
                users.filter((user) => user.isVerified).length
              }`
            : `Number of users registered (verified): ${
                filteredUsers.filter((user) => user.isVerified).length
              }`}
        </div>
        <div className={`user-count${DarkMode ? "-dark" : ""}`}>
          {searchInput === ""
            ? `Number of users filled accommodation form (pending verification):
            ${
              users.filter(
                (user) =>
                  user.accommodationFormFilled && !user.accommodationVerified
              ).length
            }`
            : `Number of users filled accommodation form (pending verification):
            ${
              filteredUsers.filter(
                (user) =>
                  user.accommodationFormFilled && !user.accommodationVerified
              ).length
            }`}
        </div>
        <div className={`user-count${DarkMode ? "-dark" : ""}`}>
          {searchInput === ""
            ? `Number of users accommodation confirmed: ${
                users.filter((user) => user.accommodationVerified).length
              }`
            : `Number of users accommodation confirmed: ${
                filteredUsers.filter((user) => user.accomoodationVerified)
                  .length
              }`}
        </div>

        <input
          type="text"
          placeholder="Search by Email"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            border: DarkMode ? "1px solid #333" : "1px solid #ccc",
            borderRadius: "5px",
            width: "100%",
            margin: "20px",
            color: DarkMode ? "#fff" : "#000",
            backgroundColor: DarkMode ? "black" : "#fff",
          }}
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
              "Download All Registration Payment Receipts (ZIP)"
            )}
          </button>
          <button
            className="download-all-button"
            disabled={loadingAf}
            onClick={() => {
              setLoadingAf(true);
              downloadAllAccommodationReceipts();
            }}
          >
            {loadingAf ? (
              <Loading
                color={"#fff"}
                height={"20%"}
                width={"20%"}
                divHeight={"20px"}
                divWidth={"128px"}
              />
            ) : (
              "Download All Accommodation Payment Receipts (ZIP)"
            )}
          </button>
        </div>
        <div className={`table-container${DarkMode ? "-dark" : ""}`}>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Verify Registration</th>
                <th>Verify Accommodation</th>
                <th>Accommodation Receipt</th>
                <th>Registration Receipt</th>
                <th>ISHMT ID</th>
                <th>User Data</th>
                <th>Delete User Accommodation</th>
                <th>Delete User</th>
              </tr>
            </thead>
            <tbody>
              {searchInput !== "" &&
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.userEmail}</td>
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

                    <td>
                      {user.accommodationFormFilled ? (
                        <input
                          type="checkbox"
                          checked={user.accommodationVerified}
                          onClick={() => {
                            handleVerifyUserAccommodation(user._id);
                          }}
                          className={
                            user.accommodationVerified ? "" : "enabled-cursor"
                          }
                          disabled={user.accommodationVerified}
                        />
                      ) : null}
                    </td>

                    <td>
                      {user.accommodationFormFilled ? (
                        <button
                          className="download-button"
                          onClick={() => {
                            handleLoadingStateChange(
                              user._id,
                              "downloadAccommodationReciept",
                              true
                            );
                            handleDownloadAccommodationReceipt(user._id);
                          }}
                          disabled={
                            loadingStates[user._id]
                              ?.downloadAccommodationReciept
                          }
                        >
                          {" "}
                          {loadingStates[user._id]
                            ?.downloadAccommodationReciept ? (
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
                      ) : null}
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
                        disabled={
                          loadingStates[user._id]?.downloadPaymentReciept
                        }
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
                        className="view-button"
                        onClick={() => handleDownloadUserData(user._id)}
                      >
                        View
                      </button>
                    </td>
                    <td>
                      <button
                        className="delete-button-1"
                        onClick={() => handleDeleteUserAccommodation(user._id)}
                      >
                        Delete
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
              {searchInput === "" &&
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.userEmail}</td>
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

                    <td>
                      {user.accommodationFormFilled ? (
                        <input
                          type="checkbox"
                          checked={user.accommodationVerified}
                          onClick={() => {
                            handleVerifyUserAccommodation(user._id);
                          }}
                          className={
                            user.accommodationVerified ? "" : "enabled-cursor"
                          }
                          disabled={user.accommodationVerified}
                        />
                      ) : null}
                    </td>
                    <td>
                      {user.accommodationFormFilled ? (
                        <button
                          className="download-button"
                          onClick={() => {
                            handleLoadingStateChange(
                              user._id,
                              "downloadAccommodationReciept",
                              true
                            );
                            handleDownloadAccommodationReceipt(user._id);
                          }}
                          disabled={
                            loadingStates[user._id]
                              ?.downloadAccommodationReciept
                          }
                        >
                          {" "}
                          {loadingStates[user._id]
                            ?.downloadAccommodationReciept ? (
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
                      ) : null}
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
                        disabled={
                          loadingStates[user._id]?.downloadPaymentReciept
                        }
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
                        className="view-button"
                        onClick={() => handleDownloadUserData(user._id)}
                      >
                        View
                      </button>
                    </td>
                    <td>
                      <button
                        className="delete-button-1"
                        onClick={() => handleDeleteUserAccommodation(user._id)}
                      >
                        Delete
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
