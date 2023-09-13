
import { Link } from "react-router-dom"
import "./Navbar.css"
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyContext from "../../MyContext"
import profileIcon from "../../images/profile-icon.png";

const Navbar = () => {
    const {isLoggedIn, setIsLoggedIn} = useContext(MyContext);
    const [isAdmin, setIsAdmin] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
        let token = localStorage.getItem("access");
        const isUserAdmin = JSON.parse(localStorage.getItem("isAdmin").toLowerCase());
        if(isUserAdmin){
            setIsAdmin(isUserAdmin);
        }else{
            localStorage.setItem("isAdmin",isAdmin);
        }
        if(!token){
            setIsLoggedIn(false);
        }else {
            setIsLoggedIn(true);
        }
    }, [isLoggedIn, isAdmin] );


    const onLogoutHandler = () => {
        localStorage.removeItem("access"); 
        localStorage.setItem("isAdmin", false);
        setIsAdmin(false);     
        setIsLoggedIn(false);
        navigate("/login")
    }
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark nav-bg p-3 shift">
                <Link className="navbar-brand rotate-on-hover gradient-text" to="/">BOLETO</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <Link className="nav-link with-underline-on-hover" to="/">HOME <span className="sr-only ">(current)</span></Link>
                        </li>
                        {isAdmin &&
                             (
                                <li className="nav-item active">
                                    <Link className="nav-link with-underline-on-hover" to="/dashboard">
                                         DASHBOARD <span className="sr-only ">(current)</span>
                                    </Link>
                                </li>
                            )
                        }
                    </ul>
                    {isLoggedIn ? (
                        <>
                            <div className="dropdown">
                                <a className="btn  dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-expanded="false">
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-person-circle"  viewBox="0 0 16 16" style={{color: "white"}}>
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                    </svg>   */}
                                    <img src={profileIcon} width="40px" height="40" alt="profile-icon"/>
                                </a>

                                <div className="dropdown-menu">
                                    <Link className="dropdown-item" to="/profile">My Profile</Link>
                                    <Link className="dropdown-item" to="/booking-list">My Bookings</Link>
                                    <Link className="dropdown-item" to="/settings">Settings</Link>
                                </div>
                            </div>
                            <Link
                            className="btn btn-success mx-3 logout-btn"
                            onClick={onLogoutHandler}
                            to="/login"
                            >
                            Logout
                            </Link>
                        </>

                        ) : (
                            <Link style={{textDecoration: "none", color: "white"}} type="button" className="join-btn" to={"/signup"}>Join Us</Link>
                        )}
                    
                </div>
            </nav>

        </>
    )
}

export default Navbar