import React, { useState, useEffect } from "react";
import { fetchWithToken } from "../../../API/Interceptor";
import { APIURL } from "../../../API/utils";

const DeleteMovie = () => {
  // Define state variables to store movie data
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const [visibleSuggestions, setVisibleSuggestions] = useState();


  const [movieId, setMovieId] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [token, setToken] = useState("");
  const [isFound, setIsFound] = useState(false);
  const [responseData, setResponseData] = useState({
    responseText: "",
    responseClass: "",
  });


  const movieHandleChange = async (e) => {
    const text = e.target.value;
    setSearchText(text);
    setSelectedSuggestion(text)
    if(text.length > 3) {      
      try{
           // Send a request to your backend to fetch movie name suggestions based on 'text'
           // Fetching all the movies having similar title
        const res = await fetch(`${APIURL}movies/filters/byTitle/?title=${text}`)
        const data = await res.json()
        
        if (res.ok){
          // console.log("data length ", data.data.length)
          setSuggestions(data.data);
          setVisibleSuggestions(true);
        }
  
      }catch(error){
        console.error(error);
      }
    }
  };

  const handleSuggestionClick = (movie) => {
    // Set the selected suggestion in the input field
    setSelectedSuggestion(movie.title);
    setVisibleSuggestions(prevState => !prevState);
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
    // Fetching details of a specific movie
    const apiUrl = `http://127.0.0.1:8000/api/movies/byTitle/?title=${selectedSuggestion}`

    try {
      const response = await fetch(apiUrl);

      if (response.ok) {
        const data = await response.json();
        // If the movie is found, show the delete confirmation modal
        setShowAlert(false);
        setIsFound(true);
        setMovieId(data.id)
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
            <div className="col-6">
              <input
                  type="text"
                  className="form-control"
                  id="movie_title"
                  name="movie_title"
                  onChange={movieHandleChange}
                  value={selectedSuggestion || searchText} // Use selected suggestion if available
                  placeholder="Enter movie title..."
                  required
                />
            </div>
            <div className="col-3"></div>
            <button
              className="btn btn-danger col-3"
              data-toggle="modal"
              data-target="#exampleModal"
              onClick={handleConfirmDelete}
            >
              Delete Movie
            </button>
          </div>
          {/* Display movie name suggestions */}
          <ul className="suggestion--ul">
            {
              visibleSuggestions && (
                  suggestions.length !== 0 ? 
                    suggestions.map((movie, index) => (
                        <li className="suggestion--list" key={index} onClick={() => handleSuggestionClick(movie)}>
                          {movie.title.slice(0,30) + "..."}
                        </li>
                      )):
                      <li>No result...</li>
              )         
            }
          </ul>
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
                    Are you sure you want to delete this movie? This action cannot be undone.
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
