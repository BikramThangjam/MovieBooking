import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SeatSelection() {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const seatData = [
        // Your seat data array
    ];

    const toggleSeatSelection = (seatNumber) => {
        if (selectedSeats.includes(seatNumber)) {
            setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
        } else {
            setSelectedSeats([...selectedSeats, seatNumber]);
        }
    };

    const getSeatClass = (seatData) => {
        // Your logic to determine the seat class
    };

    const calculateTotalPrice = () => {
        let total = 0;
        selectedSeats.forEach(seatNumber => {
            const selectedSeat = seatData.find(seat => seat.seat_no === seatNumber);
            if (selectedSeat) {
                total += selectedSeat.price;
            }
        });
        return total;
    };

    return (
        <div>
            <div className="theater-container">
                <div className="screen"></div>
                <div className="mt-5">
                    {["A", "B", "C", "D", "E"].map((row) => (
                        <div className={`seat-row${row === 'B' ? ' mb-4' : ''}`} key={row}>
                            <div className="px-3 pt-1">{row}</div>
                            {Array.from({ length: 8 }, (_, index) => {
                                const seatNumber = `${row}${index + 1}`;
                                const seatClass = seatData.find(seat => seat.seat_no === seatNumber) ?
                                    getSeatClass(seatData) + ' text-center' :
                                    'seat text-center na';
                                const isSelected = selectedSeats.includes(seatNumber);
                                
                                return (
                                    <div
                                        className={isSelected ? `${seatClass} selected` : seatClass}
                                        key={seatNumber}
                                        onClick={() => toggleSeatSelection(seatNumber)}
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
                    <p>{selectedSeats.join(', ')}</p>
                </div>
                <div>
                    <h5>Total Price</h5>
                    <p>{calculateTotalPrice()}</p>
                </div>
                <div>
                    <Link className="btn btn-warning" to="">
                        Proceed
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SeatSelection;
