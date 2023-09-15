import React, { useState, useEffect } from "react";
import { fetchWithToken } from "../../../API/Interceptor";
import {RotatingLines} from "react-loader-spinner";
import { APIURL } from "../../../API/utils";

const UpdateUser = () => {
  // Define state variables to store movie data
  const [username, setUsername] = useState("");
  const [show, setShow] = useState(false);
  const [token, setToken] = useState();
  const [isLoading, setIsLoading] = useState(false)
  const [responseData, setResponseData] = useState({
    responseText:"",
    responseClass:""
});
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    is_active: true,
    is_staff: false,
    is_superuser: false
  });

  const usernameHandleChange = (e) => {
    setUsername(e.target.value);
  }

  const GetUserDetail = async (e) => {
    e.preventDefault();
    // Starting the initial laoding
    setIsLoading(true);

    const apiUrl = `${APIURL}users/getUser/?username=${username}`;
    const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    };
    const options = {
        method: 'GET', 
        headers: headers,
    }

    if(!username){
      setIsLoading(false);
      setResponseData({
        responseText: "Please enter the User Id",
        responseClass: "alert alert-danger alert-dismissible fade show"
      });
      setShow(true)

      setTimeout(()=>{
        setShow(false)
      },3000)

      return
    }

    try {
        const response = await fetchWithToken(apiUrl, options);
        const data = await response.json();    
        if (response.ok) { 
          setIsLoading(false);                 
          setUserData(data);         
          
        } else {
          setIsLoading(false);
          setUserData();
          console.error('Failed to fetch data.');
        }
    }catch (error) {
          console.error('Error:', error);
      }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "is_reserved" ? value === "true" : value;
    setUserData({
      ...userData,
      [name]: updatedValue,
      });
};

const IsAdminHandleChange = (e)=>{
    const {checked, type} = e.target;
    if (type === 'checkbox'){
        setUserData(prevData => {
            return {
                ...prevData,
                is_staff: checked,
                is_superuser: checked,
            }
        })
    }else{
        setUserData(prev => prev)
    }
    
}
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = ` ${APIURL}users/updateUser/${userData.id}/`; 
    const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    };
    const options = {
        method: 'PUT', 
        headers: headers,
        body: JSON.stringify(userData)
    }
    try {
        const response = await fetchWithToken(apiUrl, options);       
        if (response.ok) {         
            setResponseData({
                responseText: "User details updated successfully",
                responseClass: "alert alert-success alert-dismissible fade show"
            });
            setShow(true)

            setTimeout(()=>{
              setShow(false)
            },3000)
                    
            } else {
                setResponseData({
                  responseText: "Something went wrong. Could not update a user",
                  responseClass: "alert alert-warning alert-dismissible fade show"
                  });
                setShow(true)

                setTimeout(()=>{
                  setShow(false)
                },3000)
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
};


useEffect(() => {  
    const storedToken = localStorage.getItem('access');
    if (storedToken) {
    setToken(storedToken);
    }
}, []);

  return (
    <div className="position-relative">
      <div className="w-25 status-alert">
        {show && (
          <div className={responseData.responseClass} role="alert">
            {responseData && responseData.responseText}
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-label="Close"
              onClick={() => setShow(false)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        )}
      </div>
      <div className="container">
        <h1 className="text-center mt-3">Update User</h1>
        <hr className="bg-white w-50 mx-auto" />
        <form className="w-50 mx-auto" onSubmit={GetUserDetail}>
          <div className="form-group row">
            <div className="col-6">
              <input type="text" className="form-control" onChange={usernameHandleChange} placeholder="Enter username..."/>
            </div>
            <div className="col-3"></div>
            <button type="submit" className="btn btn-success col-2">GET</button>
          </div>
        </form>
        <hr className="bg-white w-50 mx-auto"/>
        {
          isLoading 
          ? (
            <div className="d-flex justify-content-center pt-5">
              <RotatingLines                   
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="40"
                visible={true}
              />
            </div>

          )
          : (           
            userData
              ? (
                <form onSubmit={handleSubmit} className='main-form'>
                <div className="overflow-auto addMovieForm">
                    <div className="form-group">
                        <label htmlFor='name'>Fullname</label>
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor='username'>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={userData.username}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor='password'>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor='email'>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <div className="">
                            <span style={{ marginRight:"1.2rem"}}>Set as admin: </span>
                            <input type="checkbox" name="isAdmin" checked={userData.is_superuser ? true : false} className="" onChange={IsAdminHandleChange}/>                           
                         </div>                                                                                           
                    </div>
                </div>
                <button type="submit" className='w-100 btn btn-success p-3'>Update</button>
            </form>
              )
              : (
                <h5 className="d-flex justify-content-center pt-5">User not found!</h5>
              )
            
          )
        }
        
      </div>
    </div>
  );
};

export default UpdateUser;
