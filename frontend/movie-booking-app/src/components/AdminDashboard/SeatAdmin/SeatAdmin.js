import "./SeatAdmin.css";
import { Link, Outlet } from "react-router-dom";
const SeatAdmin = () => {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-bg p-0">                   
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
                        <ul className="navbar-nav nav-li">
                            <Link className="nav-link navi-link" to="add-seat"><li className="nav-item">Add Seat</li></Link>
                            <Link className="nav-link navi-link" to="update-seat"><li className="nav-item">Update Seat</li></Link>
                        </ul>
                    </div>
            </nav>
            <div className="container">
                <Outlet/>
            </div>
        </div>
    )
}

export default SeatAdmin;