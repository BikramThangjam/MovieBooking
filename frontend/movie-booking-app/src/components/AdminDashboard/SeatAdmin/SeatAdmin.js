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
                        <li className="nav-item active">
                                <Link className="nav-link" to="add-seat">ADD SEAT</Link>
                            </li>
                            <li className="nav-item active">
                                <Link className="nav-link" to="update-seat">UPDATE SEAT</Link>
                            </li>
                            
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