import React, { useState, useEffect } from "react";
import { fetchWithToken } from "../../../API/Interceptor";
import {RotatingLines} from "react-loader-spinner";
import "./UpdateMovie.css";
import { APIURL } from "../../../API/utils";
const UpdateMovie = () => {
  // Define state variables to store movie data
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const [visibleSuggestions, setVisibleSuggestions] = useState();

  const [movieId, setMovieId] = useState()
  const [show, setShow] = useState(false);
  const [token, setToken] = useState();
  const [isLoading, setIsLoading] = useState(false)
  const [responseData, setResponseData] = useState({
    responseText:"",
    responseClass:""
});
  const [movieData, setMovieData] = useState({
    category: "",
    title: "",
    description: "",
    genre: [],
    language: "",
    rating: "",
    votes: 0,
    image: "",
    movie_length: 0,
    release_date: "",
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

  const GetMovieDetail = async (e) => {
    e.preventDefault();
    // Starting the initial laoding
    setIsLoading(true); 
    // Fetching details of a specific movie
    const apiUrl = `${APIURL}movies/byTitle/?title=${selectedSuggestion}`
    try {
        const response = await fetch(apiUrl)  
        const data = await response.json();    
        if (response.ok) { 
          setIsLoading(false);       
          // mapping only the genre ids from response
          data["genre"] = data.genre.map(gen => gen.id);
          setMovieData(data)
          setMovieId(data.id)                            
        } else {
          setMovieData();
          setIsLoading(false);
          console.error('Failed to fetch data.');
        }
      } catch (error) {
          console.error('Error:', error);
      }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovieData({
      ...movieData,
      [name]: value,
      });
};

const handleGenreChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
    parseInt(option.value)
    );
    setMovieData({
    ...movieData,
    genre: selectedOptions,
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(movieData)

    const apiUrl = `${APIURL}movies/update/${movieId}/`; 
    const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    };
    const options = {
        method: 'PUT', 
        headers: headers,
        body: JSON.stringify(movieData)
    }
    try {
        const response = await fetchWithToken(apiUrl, options);       
        if (response.ok) {
            
            setResponseData({
                responseText: "Movie details updated successfully",
                responseClass: "alert alert-success alert-dismissible fade show"
            });
            setShow(true)

            setTimeout(()=>{
              setShow(false)
            },3000)
                    
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
};


useEffect(() => {  
    const storedToken = localStorage.getItem('access');
    if (storedToken) {
    setToken(storedToken);
    }
}, []);

  return (
    <div className="position-relative">
      <div className="w-25 status-alert">
        {show && (
          <div className={responseData.responseClass} role="alert">
            {responseData && responseData.responseText}
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-label="Close"
              onClick={() => setShow(false)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        )}
      </div>
      <div className="container">
        
        <hr className="bg-white w-50 mx-auto" />
        <form className="w-50 mx-auto" onSubmit={GetMovieDetail}>
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
            <button type="submit" className="btn btn-success col-3">GET</button>
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
        <hr className="bg-white w-50 mx-auto"/>
        {
          isLoading 
          ? (
            <div className="d-flex justify-content-center pt-5">
              <RotatingLines                   
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="40"
                visible={true}
              />
            </div>

          )
          : (           
              movieData
              ? (
                <form onSubmit={handleSubmit} className="main-form ">
                  <div className="overflow-auto addMovieForm">
                    <div className="form-group">
                      <label htmlFor="category">Category</label>
                      <select
                        className="form-control"
                        id="category"
                        name="category"
                        value={movieData.category}
                        onChange={handleChange}
                        
                      >
                        <option value="">Select</option>
                        <option value="popular">Popular</option>
                        <option value="top_rated">Top Rated</option>
                        <option value="upcoming">Upcoming</option>
                      </select>
                    </div>
        
                    <div className="form-group">
                      <label htmlFor="title">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={movieData.title}
                        onChange={handleChange}
                        
                      />
                    </div>
        
                    <div className="form-group">
                      <label htmlFor="description">Description</label>
                      <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows="4"
                        value={movieData.description}
                        onChange={handleChange}
                        
                      ></textarea>
                    </div>
        
                    <div className="form-group">
                      <label htmlFor="genre">Genre</label>
                      <select
                        multiple
                        className="form-control"
                        id="genre"
                        name="genre"
                        value={movieData.genre}
                        onChange={handleGenreChange}
                        
                      >
                        <option value={1}>Action</option>
                        <option value={2}>Adventure</option>
                        <option value={3}>Animation</option>
                        <option value={4}>Comedy</option>
                        <option value={5}>Crime</option>
                        <option value={6}>Documentary</option>
                        <option value={7}>Drama</option>
                        <option value={8}>Family</option>
                        <option value={9}>Fantasy</option>
                        <option value={10}>History</option>
                        <option value={11}>Horror</option>
                        <option value={12}>Music</option>
                        <option value={13}>Mystery</option>
                        <option value={14}>Romance</option>
                        <option value={15}>Science Fiction</option>
                        <option value={16}>TV Movie</option>
                        <option value={17}>Thriller</option>
                        <option value={18}>War</option>
                        <option value={19}>Western</option>
                      </select>
                    </div>
        
                    <div className="form-group">
                      <label htmlFor="language">Language</label>
                      <input
                        type="text"
                        className="form-control"
                        id="language"
                        name="language"
                        placeholder="en, es, fr, ja, ..."
                        value={movieData.language}
                        onChange={handleChange}
                        
                      />
                    </div>
        
                    <div className="form-group">
                      <label htmlFor="rating">Rating</label>
                      <input
                        type="text"
                        className="form-control"
                        id="rating"
                        name="rating"
                        placeholder="PG, PG-13, R, G"
                        value={movieData.rating}
                        onChange={handleChange}
                        
                      />
                    </div>
        
                    <div className="form-group">
                      <label htmlFor="votes">Number of Votes</label>
                      <input
                        type="number"
                        className="form-control"
                        id="votes"
                        name="votes"
                        value={movieData.votes}
                        onChange={handleChange}
                        
                      />
                    </div>
        
                    <div className="form-group">
                      <label htmlFor="image">Image URL</label>
                      <input
                        type="text"
                        className="form-control"
                        id="image"
                        name="image"
                        value={movieData.image}
                        onChange={handleChange}
                        
                      />
                    </div>
        
                    <div className="form-group">
                      <label htmlFor="movieLength">Movie Length (in minutes)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="movieLength"
                        name="movie_length"
                        value={movieData.movie_length}
                        onChange={handleChange}
                        
                      />
                    </div>
        
                    <div className="form-group">
                      <label htmlFor="releaseDate">Release Date</label>
                      <input
                        type="date"
                        className="form-control"
                        id="releaseDate"
                        name="release_date"
                        value={movieData.release_date}
                        onChange={handleChange}
                        
                      />
                    </div>
                  </div>
        
                  <button type="submit" className=" w-100 btn btn-success p-3">
                    Update Movie
                  </button>
                </form>
              )
              : (
                <h5 className="d-flex justify-content-center pt-5">Movie not found!</h5>
              )
            
          )
        }
        
      </div>
    </div>
  );
};

export default UpdateMovie;
