
import { Link, Outlet } from "react-router-dom";
import "./MovieAdmin.css";
const MovieAdmin = () => {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-bg p-0">                   
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
                    <ul className="navbar-nav nav-li">
                        <Link className="nav-link  navi-link" to="add-movie">
                            <li className="nav-item">Add Movie</li>
                        </Link>
                        <Link className="nav-link  navi-link" to="update-movie">
                            <li className="nav-item ">Update Movie</li>
                        </Link>
                        <Link className="nav-link  navi-link" to="delete-movie">
                            <li className="nav-item ">Delete Movie</li>
                        </Link>  
                    </ul>
                </div>
            </nav>
            <Outlet/>
        </div>
    )
}

export default MovieAdmin;