import { useEffect, useState, useContext } from "react";
import "./SeatSelection.css";
import { Link, useParams } from "react-router-dom";
import MyContext from "../../MyContext";
import { APIURL } from "../API/utils";

const SeatSelection = () => {
  const { theater_id, movie_id } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const { summary, setSummary } = useContext(MyContext);

  const url = `${APIURL}seats/all/by_theater_movie_id/`;

  const reqBody = {
    theater_id,
    movie_id,
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  };
  const fetchAllSeats = async () => {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        setSeats(data);
      } else {
        console.error("Failed to fetch seats");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchAllSeats();
  }, []);

  const getSeatClass = (seat) => {
    if (seat.is_reserved) {
      return "seat occupied text-center";
    } else {
      return "seat text-center";
    }
  };

  const toggleSeatSelection = (seat_no, seat_id, isReserved) => {
    const seatElement = document.getElementById(seat_no);
    if (seatElement.classList.contains('na') || isReserved) {
        return; // Don't toggle reserved seats
    }

    if (selectedSeats.some(seat => seat.seat_no === seat_no)) {
        setSelectedSeats(selectedSeats.filter(seat => seat.seat_no !== seat_no));
    } else {
        setSelectedSeats([
            ...selectedSeats,
            {   
                seat_id,
                seat_no               
            }
        ]);
    }
};

  const calculateTotalPrice = () => {
    let total = 0;
    selectedSeats.forEach((selectedSeat) => {
      const newSelectedSeat = seats.find((seat) => seat.seat_no === selectedSeat.seat_no);
      if (newSelectedSeat) {
        total += newSelectedSeat.price;
      }
    });
    return total;
  };

  const handleClick = ()=>{
    const updatedObj = {
        ...summary,
        seatsSelected: selectedSeats,
        total: calculateTotalPrice()
    }
    setSummary(updatedObj)
  }

  return (
    <div className="container">
      <p className="text-center display-4 text-secondary">
        Please select the seats
      </p>
      <ul className="showcase">
        <li>
          <div className="seat"></div>
          <small>Available</small>
        </li>
        <li>
          <div className="seat selected"></div>
          <small>Selected</small>
        </li>
        <li>
          <div className="seat occupied"></div>
          <small>Reserved</small>
        </li>
        <li>
          <div className="seat na"></div>
          <small>NA</small>
        </li>
      </ul>
      <div className="theater-container">
        <div className="screen"></div>
        <div className="mt-5">
          {["A", "B", "C", "D", "E"].map((row) => (
            <div className={`seat-row${row === "B" ? " mb-4" : ""}`} key={row}>
              <div className="px-3 pt-1">{row}</div>

              {Array.from({ length: 8 }, (_, index) => {

                const seat_no = `${row}${index + 1}`;
                const seatData = seats.find(seat => seat.seat_no === seat_no)
                const seatClass = seatData ? getSeatClass(seatData) : "seat text-center na";
                const isSelected = selectedSeats.some(seat => seat.seat_no === seat_no);
                const isReserved = seatData && seatData.is_reserved;
                
                return (
                    <div
                    className={`${seatClass}${isSelected ? ' selected' : ''}`}
                    key={seat_no}
                    id={seat_no}
                    onClick={() => toggleSeatSelection(seat_no, seatData && seatData.id, isReserved)}
                >
                    {index + 1}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="footer-container mt-3">
        <div>
          <h5>Seats selected</h5>
          <p>
            {selectedSeats.length > 0 ? selectedSeats.map(seat => seat.seat_no).join(', ') : "None"}
          </p>
        </div>
        <div>
          <h5>Total Price</h5>
          <p>{calculateTotalPrice()}</p>
        </div>
        <div>
          <Link style={{textDecoration:"none", color:"white"}} className="proceed-btn" to="/booking-summary" onClick={handleClick}>
            Proceed
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
