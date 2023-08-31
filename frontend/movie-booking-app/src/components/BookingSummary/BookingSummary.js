import { useContext } from "react";
import { Link } from "react-router-dom";
import "./BookingSummary.css";
import MyContext from "../../MyContext";

const BookingSummary = () => {
    const { summary, setSummary } = useContext(MyContext);
    // if(summary){
    //     console.log("summary--",summary)
    // }
    
    return (
        <div className="row">
            <div className="col-4"></div>
            <div className="col-4 booking p-3 mt-5">
                <h3 className="text-center ">BOOKING SUMMARY</h3>
                <hr/>
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
                    <Link style={{textDecoration:"none"}} className="btn btn-danger " to="">Confirm Booking</Link>
                </div>
            </div>
            <div className="col-4"></div>
        </div>
    )
}

export default BookingSummary;