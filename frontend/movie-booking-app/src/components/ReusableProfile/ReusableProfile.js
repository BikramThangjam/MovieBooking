import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation} from "react-router-dom";
import MyContext from "../../MyContext";
import "./ReusableProfile.css";
import { fetchWithToken } from "../API/Interceptor";
import profileImg from "../..//images/profile-icon.png";
// const bgImgURL = "https://images.pexels.com/photos/354939/pexels-photo-354939.jpeg?auto=compress&cs=tinysrgb&w=600"
import bgImgURL from "../../images/profile-bg-1.jpg";
import { RotatingLines } from "react-loader-spinner";
import { APIURL } from "../API/utils";



const ReusableProfile = () => {
    const {setIsLoggedIn} = useContext(MyContext);
    const [userDetail, setUserDetail] = useState()
    const [token, setToken] = useState()
    let navigate = useNavigate();
    const location = useLocation() //Get current location
    const [responseData, setResponseData] = useState({
        responseText: "",
        responseClass: "",
    });

    const fetchUserDetail = async (token) => {
        const apiUrl = `${APIURL}users/profile/`; 
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

    const onDeleteHandler = async(e) => {
        const apiUrl = `${APIURL}users/profile/delete/`; 
        const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        };
        const options = {
            method: 'DELETE', 
            headers: headers,
        }
        try {
            const response = await fetchWithToken(apiUrl, options);       
            if (response.ok) {
                setResponseData({
                    responseText: `Account has been deleted. Redirecting...`,
                    responseClass: "alert alert-danger",
                });
                          
                setTimeout(()=>{
                    navigate("/")
                    setIsLoggedIn(false)
                    localStorage.removeItem("access");
                }, 2000)               
              
            } else {
              console.error('Failed to fetch data');
            }
          } catch (error) {
            console.error('Error:', error);
          }       
    }

    useEffect(() => {
        const storedToken = localStorage.getItem('access');
        if (storedToken) {
          setToken(storedToken);
          fetchUserDetail(storedToken);
        }
    }, []);

    return (
        <>
            <div className="container">
                <div className="d-flex justify-content-end">
                    {/* <div className="alert alert-danger" role="alert">This is an alert</div> */}
                    <div className={responseData.responseClass} role="alert">
                        {responseData && responseData.responseText}
                    </div>
                </div>
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
                                    <h3 className="text-dark">
                                        {
                                            userDetail 
                                            ? userDetail.name 
                                            : (
                                                <RotatingLines                   
                                                    strokeColor="grey"
                                                    strokeWidth="5"
                                                    animationDuration="0.75"
                                                    width="30"
                                                    visible={true}
                                                />
                                            ) }
                                    </h3>
                                    <div className="  mb-3 ">
                                        {
                                            location.pathname === "/profile" && (
                                                <>
                                                    <p>{userDetail && `Username: ${userDetail.username}`}</p>
                                                    <p>{userDetail && `Email: ${userDetail.email}`}</p>
                                                    <p>
                                                        {userDetail && `Status: `}
                                                        <span className={userDetail && userDetail.is_active && "active"}>
                                                            {userDetail && ` ${userDetail.is_active ? "Active" : "Inactive" }`}
                                                        </span>
                                                    </p>
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
                                            <button className="btn btn-warning btn-block" data-toggle="modal" data-target="#exampleModal">
                                                Delete Account
                                            </button>

                                        </>
                                        )
                                    }                                                                      
                                    </div>
                                    
                                    {/* Model for Delete Account Confirmation */}
                                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title text-dark" id="exampleModalLabel">Confirm Account Deletion</h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body text-dark">
                                                    Are you sure you want to delete your account? This action cannot be undone.
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary text-white" data-dismiss="modal">Cancel</button>
                                                    <button type="button" className="btn btn-danger text-white" data-dismiss="modal" onClick={onDeleteHandler}>Confirm Delete</button>
                                                </div>
                                            </div>
                                        </div>
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