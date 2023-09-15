import React, { useState, useEffect } from "react";
import { fetchWithToken } from "../../../API/Interceptor";
import {RotatingLines} from "react-loader-spinner";
import { APIURL } from "../../../API/utils";

const UpdateTheater = () =>{
      // Define state variables to store movie data
      const [searchText, setSearchText] = useState('');
      const [suggestions, setSuggestions] = useState([]);
      const [selectedSuggestion, setSelectedSuggestion] = useState({
        id: '',
        name: '',
      });
      const [visibleSuggestions, setVisibleSuggestions] = useState();

    const [theaterId, setTheaterId] = useState()
    const [show, setShow] = useState(false);
    const [token, setToken] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const [responseData, setResponseData] = useState({
        responseText:"",
        responseClass:""
    });
  const [theaterData, setTheaterData] = useState({
    movie: '',
    name: '',
    address: '',
    city: '',
    pincode: '',
    movie_timing: '2023-09-20T18:00:00Z',
  });

  const theaterHandleChange = async (e) => {
    const text = e.target.value;
    setSearchText(text);
    setSelectedSuggestion(prev=>{
        return {
            ...prev,
            name : text
        }
    })
    if(text.length > 3) {      
      try{
           // Send a request to your backend to fetch movie name suggestions based on 'text'
        // Fetching all the movies having similar title
        const res = await fetch(`${APIURL}theaters/byName/?name=${text}`)
        const data = await res.json()
        
        if (res.ok){
          setSuggestions(data);
          setVisibleSuggestions(true);
        }
  
      }catch(error){
        console.error(error);
      }
    }
      
  };

  const handleSuggestionClick = (theater) => {
    // Set the selected suggestion in the input field
    setSelectedSuggestion(prev=>{
        return {
            ...prev,
            id: theater.id,
            name: theater.name
        }
    });
    setVisibleSuggestions(prevState => !prevState);
  };

  const GetTheaterDetail = async (e) => {
    e.preventDefault();
    // Starting the initial laoding
    setIsLoading(true);

    const apiUrl = `${APIURL}theater/get/${selectedSuggestion.id}/`
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        };
        const options = {
            method: 'GET', 
            headers: headers,
        }

    try {
        const response = await fetchWithToken(apiUrl, options)  
        const data = await response.json();    
        if (response.ok) { 
          setIsLoading(false);
          setTheaterData(data)
          setTheaterId(data.id)
        //   console.log("movie_timing--",data.movie_timing)                            
        } else {
          setTheaterData();
          setIsLoading(false);
          console.error('Failed to fetch data.');
        }
      } catch (error) {
          console.error('Error:', error);
      }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTheaterData({
      ...theaterData,
      [name]: value,
      });
};

const formatMovieTiming = (timing)=>{
    // data coming from backend is in "2023-09-16T19:30:00Z" format
    // input datetime-local doesnot support above format, as The format should be in "yyyy-MM-ddThh:mm"
    // So I have sliced timing till 16 characters i.e., "2023-09-16T19:30".  
    const formattedDate = timing.slice(0, 16);
    return formattedDate
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(theaterData)

    const apiUrl = `${APIURL}theater/update/${theaterId}/`; 
    const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    };
    const options = {
        method: 'PUT', 
        headers: headers,
        body: JSON.stringify(theaterData)
    }
    try {
        const response = await fetchWithToken(apiUrl, options);       
        if (response.ok) {
            
            setResponseData({
                responseText: "Theater details updated successfully",
                responseClass: "alert alert-success alert-dismissible fade show"
            });
            setShow(true)

            setTimeout(()=>{
              setShow(false)
            },3000)
                    
            } else {
                setResponseData({
                    responseText: "Something went wrong. Could not update a theater",
                    responseClass: "alert alert-warning alert-dismissible fade show"
                    });
                  setShow(true)
  
                  setTimeout(()=>{
                    setShow(false)
                  },3000)
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
        // console.log("movie_timing-", theaterData.movie_timing)
        // console.log("formatted movie_timing-",formatMovieTiming(theaterData.movie_timing))
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
                <form className="w-50 mx-auto" onSubmit={GetTheaterDetail}>
                    <div className="form-group row">
                        <div className="col-6">
                            <input
                                type="text"
                                className="form-control"
                                id="theater_name"
                                name="theater_name"
                                onChange={theaterHandleChange}
                                value={selectedSuggestion.name || searchText} // Use selected suggestion if available
                                placeholder="Enter theater name..."
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
                                suggestions.map((theater, index) => (
                                    <li className="suggestion--list" key={index} onClick={() => handleSuggestionClick(theater)}>
                                        {theater.name.length > 30 ? theater.name.slice(0,30) + "..." : theater.name}, {theater.city}, {formatMovieTiming(theater.movie_timing)} 
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
                    theaterData
                    ? (
                    <form onSubmit={handleSubmit} className="main-form ">
                        <div className="overflow-auto seat-form">
    
                            <div className="form-group">
                                <label htmlFor="movie">Movie Id</label>
                                <input
                                type="number"
                                className="form-control"
                                id="movie"
                                name="movie"
                                value={theaterData?.movie}
                                onChange={handleChange}
                                
                                />
                            </div>
                        
                            <div className="form-group">
                                <label htmlFor="name">Theater Name</label>
                                <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={theaterData?.name}
                                onChange={handleChange}
                                
                                />
                            </div>
                
                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <input
                                type="text"
                                className="form-control"
                                id="address"
                                name="address"
                                value={theaterData?.address}
                                onChange={handleChange}
                                
                                />
                            </div>
                
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input
                                type="text"
                                className="form-control"
                                id="city"
                                name="city"
                                value={theaterData?.city}
                                onChange={handleChange}
                                
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pincode">Pincode</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="pincode"
                                    name="pincode"
                                    value={theaterData?.pincode}
                                    onChange={handleChange}                           
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="movie_timing">Movie Timing</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    id="movie_timing"
                                    name="movie_timing"
                                    value={formatMovieTiming(theaterData.movie_timing)}
                                    onChange={handleChange}                           
                                />
                            </div>
                        
                        </div>
            
                        <button type="submit" className=" w-100 btn btn-success p-3">
                            Update Theater
                        </button>
                    </form>
                    )
                    : (
                    <h5 className="d-flex justify-content-center pt-5">Theater not found!</h5>
                    )
                
                )
            }
            
            </div>
      </div>
    )
}

export default UpdateTheater;