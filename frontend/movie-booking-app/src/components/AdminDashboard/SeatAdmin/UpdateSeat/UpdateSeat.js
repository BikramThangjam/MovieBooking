import React, { useState, useEffect } from "react";
import { fetchWithToken } from "../../../API/Interceptor";
import {RotatingLines} from "react-loader-spinner";
import { APIURL } from "../../../API/utils";

const UpdateSeat = () => {
  // Define state variables to store movie data
  const [seatId, setSeatId] = useState("")
  const [show, setShow] = useState(false);
  const [token, setToken] = useState();
  const [isLoading, setIsLoading] = useState(false)
  const [responseData, setResponseData] = useState({
    responseText:"",
    responseClass:""
});
  const [seatData, setSeatData] = useState({
        theater: "",
        movie: "",
        seat_no: "",
        is_reserved: false,
        category: "regular",
        price: 0.00,
  });

  const seatIdHandleChange = (e) => {
    setSeatId(e.target.value);
  }

  const GetSeatDetail = async (e) => {
    e.preventDefault();
    // Starting the initial laoding
    setIsLoading(true);

    const apiUrl = `${APIURL}seats/${seatId}/`
    const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    };
    const options = {
        method: 'GET', 
        headers: headers,
    }

    if(!seatId){
      setIsLoading(false);
      setResponseData({
        responseText: "Please enter the seat Id",
        responseClass: "alert alert-danger alert-dismissible fade show"
      });
      setShow(true)

      setTimeout(()=>{
        setShow(false)
      },3000)

      return
    }

    try {
        const response = await fetchWithToken(apiUrl, options);
        const data = await response.json();    
        if (response.ok) { 
          setIsLoading(false);                 
          setSeatData(data)                            
        } else {
          setIsLoading(false);
          setSeatData();
          console.error('Failed to fetch data.');
        }
    }catch (error) {
          console.error('Error:', error);
      }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "is_reserved" ? value === "true" : value;
    setSeatData({
      ...seatData,
      [name]: updatedValue,
      });
};
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = ` ${APIURL}seat/update/${seatId}/`; 
    const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    };
    const options = {
        method: 'PUT', 
        headers: headers,
        body: JSON.stringify(seatData)
    }
    try {
        const response = await fetchWithToken(apiUrl, options);       
        if (response.ok) {
            
            setResponseData({
                responseText: "Seat details updated successfully",
                responseClass: "alert alert-success alert-dismissible fade show"
            });
            setShow(true)

            setTimeout(()=>{
              setShow(false)
            },3000)
                    
            } else {
                setResponseData({
                  responseText: "Something went wrong. Could not update a seat",
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
        <h1 className="text-center mt-3">Update Seat</h1>
        <hr className="bg-white w-50 mx-auto" />
        <form className="w-50 mx-auto" onSubmit={GetSeatDetail}>
          <div className="form-group row">
            <label htmlFor="seatId" className="col-3 col-form-label">Enter Seat ID</label>
            <div className="col">
              <input type="number" className="form-control" id="movieId" onChange={seatIdHandleChange}/>
            </div>
            <button type="submit" className="btn btn-success col-3">GET</button>
          </div>
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
              seatData
              ? (
                <form onSubmit={handleSubmit} className="main-form ">
                  <div className="overflow-auto seat-form">

                  <div className="form-group">
                      <label htmlFor="seat_no">Seat No</label>
                      <input
                        type="text"
                        className="form-control"
                        id="seat_no"
                        name="seat_no"
                        value={seatData.seat_no}
                        onChange={handleChange}
                        
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="is_reserved">Is reserved</label>
                      <select
                        className="form-control"
                        id="is_reserved"
                        name="is_reserved"
                        value={seatData.is_reserved}
                        onChange={handleChange}                       
                      >
                        <option value={false}>False</option>
                        <option value={true}>True</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="category">Category</label>
                      <select
                        className="form-control"
                        id="category"
                        name="category"
                        value={seatData.category}
                        onChange={handleChange}
                        
                      >
                        <option value="">Select</option>
                        <option value="regular">Regular</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>
        
                    <div className="form-group">
                      <label htmlFor="price">Price</label>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={seatData.price}
                        onChange={handleChange}
                        
                      />
                    </div>
        
                    <div className="form-group">
                      <label htmlFor="theater">Theater Id</label>
                      <input
                        type="number"
                        className="form-control"
                        id="theater"
                        name="theater"
                        placeholder="PG, PG-13, R, G"
                        value={seatData.theater}
                        onChange={handleChange}
                        
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="movie">Movie Id</label>
                      <input
                        type="number"
                        className="form-control"
                        id="movie"
                        name="movie"
                        placeholder="PG, PG-13, R, G"
                        value={seatData.movie}
                        onChange={handleChange}
                        
                      />
                    </div>
                    
                  </div>
        
                  <button type="submit" className=" w-100 btn btn-success p-3">
                    Update Seat
                  </button>
                </form>
              )
              : (
                <h5 className="d-flex justify-content-center pt-5">Seat not found!</h5>
              )
            
          )
        }
        
      </div>
    </div>
  );
};

export default UpdateSeat;
