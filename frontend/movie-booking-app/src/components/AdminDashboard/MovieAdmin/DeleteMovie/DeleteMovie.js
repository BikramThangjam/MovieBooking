import React, { useState, useEffect } from "react";
import { fetchWithToken } from "../../../API/Interceptor";

const DeleteMovie = () => {
  // Define state variables to store movie data
  const [movieId, setMovieId] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [token, setToken] = useState("");
  const [isFound, setIsFound] = useState(false);
  const [responseData, setResponseData] = useState({
    responseText: "",
    responseClass: "",
  });


  const movieIdHandleChange = (e) => {
    setMovieId(e.target.value);
  };

  const handleDelete = async () => {
    // console.log("handleDelete function is executing..");
    const deleteApiUrl = `http://127.0.0.1:8000/api/movies/delete/${movieId}/`;
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
          responseText: "Entered Movie has been deleted.",
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
    // console.log("HandleConfirmDelete function is executing...");
    const getMovieUrl = `http://127.0.0.1:8000/api/movies/${movieId}/`;

    if (!movieId) {
      // Show an alert if movieId is not provided
      setResponseData({
        responseText: "Please enter a Movie ID.",
        responseClass: "alert alert-danger alert-dismissible fade show",
      });
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 1300);
      return;
    }

    try {
      const response = await fetchWithToken(getMovieUrl);

      if (response.ok) {
        // If the movie is found, show the delete confirmation modal
        setShowAlert(false);
        setIsFound(true);
      } else if (response.status === 404) {
        // If the movie is not found, display an alert
        setResponseData({
          responseText: "Movie not found!",
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
    // console.log("useEffect is executing...")
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
        <h1 className="text-center mt-3">Delete Movie</h1>
        <hr className="bg-white w-50 mx-auto" />
        <form 
          className="w-50 mx-auto" 
          onSubmit={(e) => {
            e.preventDefault(); // Prevent the form submission
          }}>

          <div className="form-group row">
            <label htmlFor="movieId" className="col-3 col-form-label">
              Enter Movie ID
            </label>
            <div className="col">
              <input
                type="number"
                className="form-control"
                id="movieId"
                onChange={movieIdHandleChange}
              />
            </div>
            <button
              className="btn btn-danger col-3"
              data-toggle="modal"
              data-target="#exampleModal"
              onClick={handleConfirmDelete}
            >
              Delete Movie
            </button>
          </div>
        </form>
        {/* Model for Delete Account Confirmation */}
        {
          isFound &&
              <div
              className="modal fade"
              id="exampleModal"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
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
                    Are you sure you want to delete the movie associated with movie_id: {movieId}? This action cannot
                    be undone.
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

export default DeleteMovie;
