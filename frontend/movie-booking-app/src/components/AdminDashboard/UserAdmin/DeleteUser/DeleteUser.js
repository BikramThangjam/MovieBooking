import React, { useState, useEffect } from "react";
import { fetchWithToken } from "../../../API/Interceptor";
import { APIURL } from "../../../API/utils";

const DeleteUser = () => {
  
  const [username, serUsername] = useState("");
  const [userId, setuserId] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [token, setToken] = useState("");
  const [isFound, setIsFound] = useState(false);
  const [responseData, setResponseData] = useState({
    responseText: "",
    responseClass: "",
  });


  const usernameHandleChange = (e) => {
    serUsername(e.target.value);
  };

  const handleDelete = async () => {
    // console.log("handleDelete function is executing..");
    const deleteApiUrl = `${APIURL}users/deleteUser/${userId}/`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const options = {
      method: "DELETE",
      headers: headers,
    };
    try {
      const response = await fetchWithToken(deleteApiUrl, options);

      if (response.status === 204) {
        setResponseData({
          responseText: "User has been deleted.",
          responseClass: "alert alert-danger alert-dismissible fade show",
        });
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 1300);
        isFound(false);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleConfirmDelete = async () => {
    const getUserAPi = `${APIURL}users/getUser/?username=${username}`;
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const options = {
        method: "GET",
        headers: headers,
      };

    if (!username) {
      // Show an alert if movieId is not provided
      setResponseData({
        responseText: "Please enter a User ID.",
        responseClass: "alert alert-danger alert-dismissible fade show",
      });
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 1300);
      return;
    }

    try {
      const response = await fetchWithToken(getUserAPi, options);

      if (response.ok) {
        // If the user is found, show the delete confirmation modal
        const data = await response.json();
        setShowAlert(false);
        setIsFound(true);
        setuserId(data.id);
      } else if (response.status === 404) {
        // If the user is not found, display an alert
        setResponseData({
          responseText: "User not found!",
          responseClass: "alert alert-warning alert-dismissible fade show",
        });
        setShowAlert(true);
        setIsFound(false);
        setTimeout(() => {
          setShowAlert(false);
        }, 1300);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("access");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <div className="position-relative">
      <div className="w-25 status-alert">
        {showAlert && (
          <div className={responseData.responseClass} role="alert">
            {responseData && responseData.responseText}
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-label="Close"
              onClick={() => setShowAlert(false)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        )}
      </div>
      <div className="container">
        <h1 className="text-center mt-3">Delete User</h1>
        <hr className="bg-white w-50 mx-auto" />
        <form 
          className="w-50 mx-auto" 
          onSubmit={(e) => {
            e.preventDefault(); // Prevent the form submission
          }}>

          <div className="form-group row">
            <div className="col-6">
              <input
                type="text"
                className="form-control"
                onChange={usernameHandleChange}
                placeholder="Enter username..."
              />
            </div>
            <div className="col-3"></div>
            <button
              className="btn btn-danger col-3"
              data-toggle="modal"
              data-target="#deleteUserModal"
              onClick={handleConfirmDelete}
            >
              Delete User
            </button>
          </div>
        </form>
        {/* Model for Delete Account Confirmation */}
        {
          isFound &&
              <div
              className="modal fade"
              id="deleteUserModal"
              tabIndex="-1"
              aria-labelledby="deleteUserModal"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title text-dark" id="exampleModalLabel">
                      Confirm Delete
                    </h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body text-dark">
                    Are you sure you want to delete this user? This action cannot be undone.
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary text-white"
                      data-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-danger text-white"
                      data-dismiss="modal"
                     onClick={handleDelete}
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
        }
      </div>
    </div>
  );
};

export default DeleteUser;
