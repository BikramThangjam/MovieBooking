import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import "../../../components/ReusableProfile/ReusableProfile.css";
import { fetchWithToken } from "../../../components/API/Interceptor";
import profileImg from "../../../images/profile-icon.png";
// const bgImgURL = "https://images.pexels.com/photos/354939/pexels-photo-354939.jpeg?auto=compress&cs=tinysrgb&w=600"
import bgImgURL from "../../../images/profile-bg-1.jpg";
import { APIURL } from "../../../components/API/utils";



const UpdateProfile = () => {
    const [userDetail, setUserDetail] = useState()
    const [token, setToken] = useState()
    const [updatedUserDetail, setUpdatedUserDetail] = useState({
        name: "",
        username: "",
        email: ""
    })
    const [responseData, setResponseData] = useState({
        responseText: "" ,
        responseClass: "",
    });
    let navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('access');
        if (storedToken) {
          setToken(storedToken);
          fetchUserDetail(storedToken);
        }
      }, []);

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

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUpdatedUserDetail(prev => {
            return {
                ...prev,
                [name] : value
            }
        })
        
    }
    const handleSubmit = async (e)=>{
        e.preventDefault()
        const apiUrl = `${APIURL}users/profile/update/`
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            };
        const options = {
            method: 'PUT', 
            headers: headers,
            body: JSON.stringify(updatedUserDetail)
        }
            try {
                const response = await fetchWithToken(apiUrl, options); 
                const data = await response.json();      
                if (response.ok) {
                  setResponseData({
                    responseText: data.message,
                    responseClass: "alert alert-success"
                    });
                    
                    setTimeout(()=>{
                        navigate("/settings");
                    },2000)
                } else {
                  console.error('Failed to fetch data');
                  console.log('error: ', data)
                }
              } catch (error) {
                console.error('Error:', error);
              }

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
                                    <h3 className="text-dark">{userDetail && userDetail.name }</h3>
                                    <div className="  mb-3 "> 
                                    </div>  
                                    <div className="w-100 mx-auto">
                                        <form onSubmit={handleSubmit}>
                                            <div className="form-group row">
                                                    <label htmlFor="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm text-dark">Fullname</label>
                                                    <div className="col-sm-8">
                                                    <input type="text" name="name" value={updatedUserDetail.name} onChange={handleChange}  className="form-control form-control-sm" id="colFormLabelSm" placeholder={userDetail && userDetail.name } required/>
                                                    </div>
                                            </div>
                                            <div className="form-group row">
                                                    <label htmlFor="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm text-dark">Username</label>
                                                    <div className="col-sm-8">
                                                    <input type="text" name="username" value={updatedUserDetail.username} onChange={handleChange} className="form-control form-control-sm" id="colFormLabelSm" placeholder={userDetail && userDetail.username } required/>
                                                    </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm text-dark">Email</label>
                                                <div className="col-sm-8">
                                                <input type="email" name="email" value={updatedUserDetail.email} onChange={handleChange} className="form-control form-control-sm" id="colFormLabelSm" placeholder={userDetail && userDetail.email } required/>
                                                </div>
                                            </div>
                                            <div className={responseData.responseClass} role="alert">
                                                { responseData && responseData.responseText}
                                            </div>
                                            <div className="d-flex justify-content-end"><button type="submit" className="btn btn-success">Save</button></div>
                                        </form>                            
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

export default UpdateProfile;