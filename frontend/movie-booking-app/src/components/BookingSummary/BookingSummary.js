import { useContext, useState, useEffect } from "react";
import "./BookingSummary.css";
import MyContext from "../../MyContext";
import { fetchWithToken } from "../API/Interceptor";
import { useNavigate } from "react-router-dom";
import { APIURL } from "../API/utils";

const BookingSummary = () => {
    const { summary } = useContext(MyContext);
    const [data, setData] = useState()
    const [token, setToken] = useState();
    const navigate = useNavigate();
    const [responseData, setResponseData] = useState({
        responseText: "" ,
        responseClass: "",
    });
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const seats = summary.seatsSelected.map(seat => seat.seat_id);
        const movie = summary.movie.movie_id;
        
        setData(prev => {
            return {
                ...prev,
                seats,
                movie
            }
        })
        
        if(data){
            const apiUrl = `${APIURL}booking/add/`; 
            const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            };
            const options = {
                method: 'POST', 
                headers: headers,
                body: JSON.stringify(data)
            }
            try {
                const response = await fetchWithToken(apiUrl, options);  
                    
                if (response.ok) {
                    setResponseData({
                        responseText: "Your booking has been confirmed. Thank you :)",
                        responseClass: "alert alert-success"
                    });

                    setTimeout(()=>{
                        navigate("/booking-list");
                    },1600)
                        
                } else {
                console.error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        
    }

    useEffect(() => {
        const storedToken = localStorage.getItem('access');
        if (storedToken) {
          setToken(storedToken);
        }
      }, []);
    
    return (
        <div className="row ">
            <div className="col-4"></div>
            <div className="col-4 booking p-3 mt-5">
                <h3 className="text-center ">BOOKING SUMMARY</h3>
                <hr/>
                <div className={responseData.responseClass } role="alert">
                    { responseData && responseData.responseText}
                </div>
                <div className="content">                   
                    <p><b>Movie:</b> {summary ? summary.movie.movie_name :""}</p>
                    <p><b>Theater:</b> {summary ? summary.theater.theater_name : ""}</p>
                    <p><b>Seats selected:</b> {summary.seatsSelected.length > 0 ? summary.seatsSelected.map(seat => seat.seat_no).join(', ') : "None"} ({summary.seatsSelected.length} Tickets)</p>
                    <p><b>Start at:</b> {summary ? summary.startTime : ""}</p>
                    <hr/>
                    <div className="d-flex justify-content-between">
                        <p><b>TOTAL</b></p>
                        <p><b>Rs.{summary ? summary.total: ""}</b></p>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <button type="button" className="btn btn-danger " onClick={handleSubmit}>Confirm Booking</button>
                </div>
            </div>
            <div className="col-4"></div>
        </div>
    )
}

export default BookingSummary;