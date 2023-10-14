import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import "./accommodationWaitingList.css";

const AccommodationWaitingList = () => {
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [cookieValue, setCookieValue] = useState("");
  const [isAdmin, setAdmin] = useState(true);
  const [loading, setLoading] = useState(false);

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

  const fetchWaitingListData = async (token) => {
    try {
      const response = await axios.post(
        "https://regportal.onrender.com/accommodation/waiting-list",
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
      fetchWaitingListData(cookieValue);
    }
  }, []);


  const handleAccommodationTypeChange = async (userId, newValue) => {
    const confirmed = window.confirm(
      "Are you sure, yoh want to give the selected accommodation option to the user? Please note that this action can't be undone."
    );
    if (confirmed) {
      try {
        const response = await axios.post(
          "https://regportal.onrender.com/accommodation/update-accommodation",
          {
            userId,
            newAccommodationType: newValue,
          }
        );

        if (response.data.success === "true") {
          const updatedUsers = users.map((user) => {
            if (user._id === userId) {
              user.accommodationType = newValue;
            }
            return user;
          });

          setUsers(updatedUsers);
          toast.success("Accommodation type updated successfully.");
        } else {
          toast.error("Failed to update accommodation type.");
        }
      } catch (error) {
        toast.error("An error occurred while updating the accommodation type.");
      }
    }
  };

  const renderAccommodationTypeDropdown = (user) => {
    return (
      <select
        value={user.accommodationType}
        onChange={(e) =>
          handleAccommodationTypeChange(user._id, e.target.value)
        }
        disabled={user.accommodationType ? true : false}
      >
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
    );
  };

  return (
    isAdmin && (
      <div className="userscontainer">
        <h2>Accommodation Waiting List</h2>
        <div className="user-count">Total waiting users: {userCount}</div>
        <input
          type="text"
          placeholder="Search by Email"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Accommodation Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.userEmail}</td>
                  <td>{renderAccommodationTypeDropdown(user)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  );
};

export default AccommodationWaitingList;
