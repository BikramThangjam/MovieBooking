import React, { useState } from 'react';
import { APIURL } from '../../../API/utils';


const CreateUser = () => {
 
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        is_active: true,
        is_staff: false,
        is_superuser: false
    });

    const [responseData, setResponseData] = useState({
        responseText:"",
        responseClass:""
    });

    const handleChange = (e) => {
        const { name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleIsAdmin = (e)=>{
        const {checked, type} = e.target;
        if (type === 'checkbox'){
            setFormData(prevData => {
                return {
                    ...prevData,
                    is_staff: checked,
                    is_superuser: checked,
                }
            })
        }else{
            setFormData(prev => prev)
        }
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiUrl = `${APIURL}users/signup/`; 
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        }
        try {
            const response = await fetch(apiUrl, options);       
            if (response.ok) {
                
                setResponseData({
                    responseText: "Account has been created.",
                    responseClass: "alert alert-success alert-dismissible fade show"
                });
                setShow(true)
                
                setTimeout(()=>{
                    setShow(false)
                },3000)
                        
                } else {
                    const data = await response.json()
                    setResponseData({
                        responseText: data.message,
                        responseClass: "alert alert-danger alert-dismissible fade show"
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

  return (

    <div className="position-relative">
        <div className="w-25 status-alert">
            {
                show && (
                    <div className={responseData.responseClass} role="alert">
                        { responseData && responseData.responseText}
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={()=> setShow(false)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                )
            }
            
        </div>
        <div className="container">
            <h1 className="text-center mt-4">Create User</h1>
            <hr className="bg-white w-50 mx-auto" />
            <form onSubmit={handleSubmit} className='main-form'>
                <div className="overflow-auto addMovieForm">
                    <div className="form-group">
                        <label htmlFor='name'>Fullname</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
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
                            value={formData.username}
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
                            value={formData.password}
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
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <div className="">
                            <span style={{ marginRight:"1.2rem"}}>Set as admin: </span>
                            <input type="checkbox" name="isAdmin" className="" onChange={handleIsAdmin}/>                           
                         </div>                                                                                           
                    </div>
                </div>
                <button type="submit" className='w-100 btn btn-success p-3'>Create</button>
            </form>
        </div>
    </div>
  )
};

export default CreateUser;
