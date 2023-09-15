import { useState, useEffect } from "react";
import "./BookingList.css";
import Booking from "./Booking/Booking";
import { fetchWithToken } from "../API/Interceptor";
import {RotatingLines} from "react-loader-spinner";
import { APIURL } from "../API/utils";

const BookingList = () => {
    const [bookingList, setBookingList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false)
    const [responseData, setResponseData] = useState({
      responseText:"",
      responseClass:""
    });

    const fetchBookingList = async (token) => {
        const apiUrl = `${APIURL}booking/all/`; 
        const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        };
        const options = {
            method: 'GET', 
            headers: headers,
        }
        try {
            const response = await fetchWithToken(apiUrl, options);       
            if (response.ok) {
              const data = await response.json();
              setBookingList(data)  
              setIsLoading(false)         
            } else {
              console.error('Failed to fetch data');
            }
          } catch (error) {
            console.error('Error:', error);
          }
    }

    // Function to remove a canceled booking from the list
    const removeCanceledBooking = (bookingId) => {
      setBookingList((prevList) => prevList.filter((booking) => booking.id !== bookingId));
    };
  
    useEffect(() => {  
      const storedToken = localStorage.getItem('access');
      if (storedToken) {
        fetchBookingList(storedToken);
      }
    }, []); 

    return (
        <div className="row">
            <div className="col-4"></div>
            <div className="col-4">
              {
                isLoading
                ?
                <div className=" d-flex justify-content-center align-items-center loader">
                  <RotatingLines                   
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="40"
                    visible={true}
                  />
                </div>
                :                  
                  bookingList.length > 0
                  ?
                  <div className="booking  pt-3 mt-5">
                    <h3 className="text-center ">MY BOOKINGS</h3>
                    <hr/>
                    {
                      showSuccess && (
                        <div className={responseData.responseClass} role="alert">
                            { responseData && responseData.responseText}
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                      )
                    }
                    <ul className="booking-list">
                      {
                          bookingList.map((booking, index)=> (
                          <li key={index} style={{listStyle: "none", padding:"0px 15px"}}>
                            <Booking 
                              bookingData={booking} 
                              removeCanceledBooking={removeCanceledBooking}  
                              setShowSuccess={setShowSuccess} 
                              setResponseData={setResponseData}                          
                              />
                          </li> ))
                      }
                    </ul>
                  </div>
                  :
                  <h4 style={{marginTop: "50%"}} className="text-center">You haven't booked any tickets yet! </h4>
            
              }
                                              
            </div>
            <div className="col-4"></div>
        </div>
    )
}

export default BookingList;