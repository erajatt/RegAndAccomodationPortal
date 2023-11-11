import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./accommodationList.css";

const AccommodationList = (props) => {
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [cookieValue, setCookieValue] = useState("");
  const [isAdmin, setAdmin] = useState(true);
  const DarkMode = props.DarkMode;

  const setValues = async (token) => {
    const response = await axios.post(
      "https://regportal.onrender.com/auth/userAccess",
      {
        token,
      }
    );
    setAdmin(response.data.isAdmin);
  };

  const fetchWaitingListData = async (token) => {
    try {
      const response = await axios.post(
        "https://regportal.onrender.com/accommodation/accommodation-list",
        { token }
      );
      if (response.data.success === "true") {
        setUsers(response.data.list);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.userEmail.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchInput]);
  

  useEffect(() => {
    const cookie = document.cookie;
    const cookieArray = cookie.split("; ");
    const desiredCookie = cookieArray.find((item) =>
      item.startsWith("access_token=")
    );

    if (desiredCookie) {
      const cookieVal = desiredCookie.split("=")[1];
      setValues(cookieVal);
      setCookieValue(cookieVal);
      fetchWaitingListData(cookieVal);
    }
  }, []);

  const handleaccommodationChoiceChange = async (userID, newValue) => {
    const confirmed = window.confirm(
      `Are you sure, you want to give ${newValue} to the user?`
    );
    if (confirmed) {
      try {
        console.log(userID,cookieValue);
        const response = await axios.put(
          "https://regportal.onrender.com/accommodation/assign",
          {
            userID,
            accommodationChoice: newValue,
            token: cookieValue,
          }
        );

        if (response.data.success === "true") {
          const updatedUsers = users.map((user) => {
            if (user._id === userID) {
              user.accommodationChoice = newValue;
            }
            return user;
          });

          setUsers(updatedUsers);
          toast.success(
            "Accommodation type for the user has been updated successfully."
          );
        } else {
          toast.error("Failed to update accommodation type.");
        }
      } catch (error) {
        toast.error("Failed to update the accommodation type.");
      }
    }
  };

  const renderaccommodationChoiceDropdown = (user) => {
    return (
      <select
        value={user.accommodationChoice}
        onChange={(e) =>
          handleaccommodationChoiceChange(user._id, e.target.value)
        }
        style={
          DarkMode
            ? {
                backgroundColor: "#555",
                color: "white",
                border: "1px solid white",
              }
            : {}
        }
      >
        <option value="None">Select</option>
        <option value="Guest House (Single room) - 1400/- per day, per head">
          Guest House (Single room) - 1400/- per day, per head
        </option>
        <option value="Guest House (Double room with Double occupancy) - 2000/- per day, per head">
          Guest House (Double room with Double occupancy) - 2000/- per day, per head
        </option>
        <option value="Guest House (Double room with Single occupancy) - 1700/- per day, per head">
          Guest House (Double room with Single occupancy) - 1700/- per day, per head
        </option>
      </select>
    );
  };

  return (
    isAdmin && (
      <div className={`userscontainer${DarkMode ? "-dark" : ""}`}>
        <h2>Accommodation List</h2>
        <div className={`user-count${DarkMode ? "-dark" : ""}`}>
          {searchInput==""&&`Total waiting users: ${users.length}`}
          {searchInput!=""&&`Total waiting users: ${filteredUsers.length}`}
        </div>
        <input
          type="text"
          placeholder="Search by Email"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <div className={`table-container${DarkMode ? "-dark" : ""}`}>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Accommodation Type</th>
              </tr>
            </thead>
            <tbody>
              {searchInput != "" &&
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.userEmail}</td>
                    <td>{renderaccommodationChoiceDropdown(user)}</td>
                  </tr>
                ))}
              {searchInput == "" &&
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.userEmail}</td>
                    <td>{renderaccommodationChoiceDropdown(user)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  );
};

export default AccommodationList;
