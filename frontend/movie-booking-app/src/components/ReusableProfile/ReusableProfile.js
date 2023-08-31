import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation} from "react-router-dom";
import MyContext from "../../MyContext";
import "./ReusableProfile.css";
import { fetchWithToken } from "../API/Interceptor";
import profileImg from "../../user-male.png";
const bgImgURL = "https://images.pexels.com/photos/354939/pexels-photo-354939.jpeg?auto=compress&cs=tinysrgb&w=600"
//const profilePicURL = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXwzNDU1OTE3fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60";



const ReusableProfile = () => {
    const {isLoggedIn, setIsLoggedIn} = useContext(MyContext);
    const [userDetail, setUserDetail] = useState()
    const [token, setToken] = useState()
    let navigate = useNavigate();
    const location = useLocation() //Get current location

    useEffect(() => {
        const storedToken = localStorage.getItem('access');
        if (storedToken) {
          setToken(storedToken);
          fetchUserDetail(storedToken);
        }
      }, []);

    const fetchUserDetail = async (token) => {
        const apiUrl = 'http://127.0.0.1:8000/api/users/profile/'; 
        // console.log("token--",token)
        const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        };
        const options = {
            method: 'GET', 
            headers: headers,
        }
        try {
            const response = await fetchWithToken(apiUrl, options);       
            if (response.ok) {
              const data = await response.json();
              setUserDetail(data);
            //   console.log('Fetched data:', data);
            } else {
              console.error('Failed to fetch data');
            }
          } catch (error) {
            console.error('Error:', error);
          }
    }

    const onLogoutHandler = () => {
        localStorage.removeItem("access");       
        navigate("/login")
        setIsLoggedIn(false)
        
    }

    return (
        <>
            <div className="container">
                <div className="padding">
                    <div className="row">
                        <div className="col-md-4"></div>
                        <div className="col-md-4">
                            <div className="card card-shadow">
                                <img src={bgImgURL} alt="CartImageCap" className="card-img-top" />
                                <div className="card-body text-center little-profile">
                                    <div className="pro-img">
                                        <img src={profileImg} alt="user" />
                                    </div>
                                    <h3 className="text-dark">{userDetail ? userDetail.name : "..."}</h3>
                                    <div className="  mb-3 ">
                                        {
                                            location.pathname === "/profile" && (
                                                <>
                                                    <p>{userDetail && `Username: ${userDetail.username}`}</p>
                                                    <p>{userDetail && `Email: ${userDetail.email}`}</p>
                                                    <p>{userDetail && `Status: ${userDetail.is_active?"Active":"Inactive"}`}</p>
                                                </>
                                            )
                                        }
                                        
                                    </div>  
                                    <div className="w-75 mx-auto">
                                    {
                                        location.pathname === "/settings" && (
                                        <>
                                            <Link className="btn btn-dark btn-block" to="/settings/update-profile">Edit Profile</Link>
                                            <Link className="btn btn-dark btn-block" to="/settings/change-password">Change Password</Link>
                                            <Link className="btn btn-dark btn-block" onClick={onLogoutHandler} to="/login">Logout</Link>
                                        </>
                                        )
                                    }
                                                                       
                                    </div>                                 
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4"></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReusableProfile;