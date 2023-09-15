import { useState, useEffect } from "react";
import { fetchWithToken } from "../../../API/Interceptor";
import { APIURL } from "../../../API/utils";

const AddMovie = () => {
    const [token, setToken] = useState();
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        category: "",
        title: "",
        description: "",
        genre: [],
        language: "",
        rating: "",
        votes: "",
        image: "",
        movie_length: "",
        release_date: "",
    });

    const [responseData, setResponseData] = useState({
        responseText:"",
        responseClass:""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]: value,
        });
    };

    const handleGenreChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
        parseInt(option.value)
        );
        setFormData({
        ...formData,
        genre: selectedOptions,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiUrl = `${APIURL}movies/add/`; 
        const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        };
        const options = {
            method: 'POST', 
            headers: headers,
            body: JSON.stringify(formData)
        }
        try {
            const response = await fetchWithToken(apiUrl, options);       
            if (response.ok) {
                
                setResponseData({
                    responseText: "New movie added successfully",
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
            {
                show && (
                    <div className={responseData.responseClass} role="alert">
                        { responseData && responseData.responseText}
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={()=> setShow(false)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                )
            }
            
        </div>
        <div className="container">
            <h1 className="text-center mt-4">Add New Movie</h1>
            <hr className="bg-white w-50 mx-auto" />
            <form onSubmit={handleSubmit} className="main-form ">
                <div className="overflow-auto addMovieForm">
                    <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        className="form-control"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
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
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    </div>

                    <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                    </div>

                    <div className="form-group">
                    <label htmlFor="genre">Genre</label>
                    <select
                        multiple
                        className="form-control"
                        id="genre"
                        name="genre"
                        value={formData.genre}
                        onChange={handleGenreChange}
                        required
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
                        value={formData.language}
                        onChange={handleChange}
                        required
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
                        value={formData.rating}
                        onChange={handleChange}
                        required
                    />
                    </div>

                    <div className="form-group">
                    <label htmlFor="votes">Number of Votes</label>
                    <input
                        type="number"
                        className="form-control"
                        id="votes"
                        name="votes"
                        value={formData.votes}
                        onChange={handleChange}
                        required
                    />
                    </div>

                    <div className="form-group">
                    <label htmlFor="image">Image URL</label>
                    <input
                        type="text"
                        className="form-control"
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        required
                    />
                    </div>

                    <div className="form-group">
                    <label htmlFor="movieLength">Movie Length (in minutes)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="movieLength"
                        name="movie_length"
                        value={formData.movie_length}
                        onChange={handleChange}
                        required
                    />
                    </div>

                    <div className="form-group">
                        <label htmlFor="releaseDate">Release Date</label>
                        <input
                        type="date"
                        className="form-control"
                        id="releaseDate"
                        name="release_date"
                        value={formData.release_date}
                        onChange={handleChange}
                        required
                        />
                    </div> 
                </div>
                
                <button type="submit" className=" w-100 btn btn-success p-3">
                    Add Movie
                </button>
                
            </form>
        </div>
    </div>
    
  );
};

export default AddMovie;
