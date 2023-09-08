
import "./Dashboard.css";
import {Link, Outlet} from 'react-router-dom';
const Dashboard = () => {
    return (
        <div className="container-fluid main-container p-0 m-0">
            <div className="col-2 menu p-0">
                <div className="text-center left-heading">MANAGE</div>
                <ul className="text-center menu-ul">
                    <Link style={{textDecoration:"none"}} className="navi-link" to="user-admin"><li>User</li></Link>
                    <Link style={{textDecoration:"none"}} className="navi-link" to="movie-admin"><li>Movie</li></Link>
                    <Link style={{textDecoration:"none"}} className="navi-link" to="theater-admin"><li>Theater</li></Link>
                    <Link style={{textDecoration:"none"}} className="navi-link" to="seat-admin"><li>Seat</li></Link>
                </ul> 
            </div>
            <div className=" main-content">
                <Outlet/>
            </div>
        </div>

    )
}

export default Dashboard;