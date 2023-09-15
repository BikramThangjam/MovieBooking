import { useState, useEffect } from "react";
import { fetchWithToken } from "../../API/Interceptor";
import { APIURL } from "../../API/utils";

const Booking = (props) => {
  const {bookingData, setShowSuccess, setResponseData, removeCanceledBooking} = props;
  const [token, setToken] = useState()
  

  const formatBookingDate = (timing)=>{

    const dateTimeString = timing;
    const dateTime = new Date(dateTimeString);

     // Get day, month, and year from the date
     const day = dateTime.getDate().toString().padStart(2, '0');
     const month = (dateTime.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
     const year = dateTime.getFullYear();
      
    const formattedDate = `${day}/${month}/${year}`;// Format as "dd/mm/yyyy"
       
    return `${formattedDate}`
  }

  const formatMovieTiming = (timing)=>{
    const dateTimeString = timing.slice(0, 19);
    const dateTime = new Date(dateTimeString);

     // Get day, month, and year from the date
     const day = dateTime.getDate().toString().padStart(2, '0');
     const month = (dateTime.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
     const year = dateTime.getFullYear();
 
      const timeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
      };
      
      
      const formattedDate = `${day}/${month}/${year}`;// Format as "dd/mm/yyyy"
      const formattedTime = dateTime.toLocaleTimeString('en-US', timeFormatOptions);
      
    return `${formattedTime}, ${formattedDate}`
  }

  const handleCancelBooking = async (booking_id)=>{
    const apiUrl = `${APIURL}booking/delete/${booking_id}/`; 
    const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    };
    const options = {
        method: 'DELETE', 
        headers: headers,
    }
    try {
        const response = await fetchWithToken(apiUrl, options);       
        if (response.ok) {
          const data = await response.json();
          setShowSuccess(true);
          setResponseData({
            responseText: data.message,
            responseClass: "alert alert-warning alert-dismissible fade show"
        });
        
          setTimeout(()=>{
            removeCanceledBooking(booking_id);
            setShowSuccess(false);
          }, 2000)

        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    
  }

  useEffect(() => {    
    const storedToken = localStorage.getItem('access');
    if (storedToken) {
      setToken(storedToken);
    }

    // console.log(bookingData)
  }, []); 

  return (
    <div className="booking-content">     
        <p className="booking-date">Booked on: {bookingData && formatBookingDate(bookingData.created_at)}</p>
        <div className="d-flex justify-content-between align-items-center">
        <div>
          <p>
            <b>Movie:</b> {bookingData ? bookingData.movie_name : ""}
          </p>
          <p>
            <b>Theater:</b>{" "}
            {bookingData ? bookingData.theater_name : ""}
          </p>
          <p>
            <b>Seats selected:</b>{" "}
            {bookingData.seats.length > 0
              ? bookingData.seats.map((seat) => seat).join(", ")
              : "None"}{" "}
            ({bookingData.seats.length} Tickets)
          </p>
          <p>
            <b>Start at:</b> {bookingData ? formatMovieTiming(bookingData.start_at) : ""}
          </p>
          <p>
          <b>Amount paid: </b>
          Rs.{bookingData ? bookingData.total_cost : "0.00"}
        </p>
        </div>
        <div>
          <button type="button" className="btn btn-danger" onClick={()=>handleCancelBooking(bookingData.id)}>
            Cancel
          </button>
        </div>
        </div>
        <hr/>
    </div>
  );
};

export default Booking;
