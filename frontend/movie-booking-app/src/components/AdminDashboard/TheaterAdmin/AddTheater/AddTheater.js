import React, { useState, useEffect } from 'react';
import { fetchWithToken } from '../../../API/Interceptor';
import { APIURL } from '../../../API/utils';

const AddTheater = () => {
 
    const [token, setToken] = useState();
    const [show, setShow] = useState(false);
    const initialTheaterData = {
        movie: '',
        name: '',
        address: '',
        city: '',
        pincode: '',
        movie_timing: '',
      };
    const [formData, setFormData] = useState(initialTheaterData);

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

    const handleAddTheater = async (e) => {
        e.preventDefault();
        console.log(formData);
        const apiUrl = `${APIURL}theater/add/`; 
        const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        };
        const options = {
            method: 'POST', 
            headers: headers,
            body: JSON.stringify(formData)
        }
        try {
            const response = await fetchWithToken(apiUrl, options);       
            if (response.ok) {
                
                setResponseData({
                    responseText: "Theater added successfully",
                    responseClass: "alert alert-success alert-dismissible fade show"
                });
                setShow(true)
                
                setTimeout(()=>{
                    setShow(false)
                },3000)


                setFormData(initialTheaterData);
                        
                } else {
                    setResponseData({
                        responseText: "Something went wrong. Cannot add a theater.",
                        responseClass: "alert alert-success alert-dismissible fade show"
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
            <h1 className="text-center mt-4">Add a Theater</h1>
            <hr className="bg-white w-50 mx-auto" />
            <form onSubmit={handleAddTheater} className='main-form'>
                <div className="overflow-auto theater-form">
                    <div className="form-group">
                        <label htmlFor='movie'>Movie ID:</label>
                        <input
                            type="number"
                            name="movie"
                            value={formData.movie}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor='name'>Theater Name:</label>
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
                        <label htmlFor='address'>Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor='city'>City:</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>   
                    <div className="form-group">
                        <label htmlFor='pincode'>Pincode:</label>
                        <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div> 
                    <div className="form-group">
                        <label htmlFor='movie_timing'>Movie Timing:</label>
                        <input
                            type="datetime-local"
                            name="movie_timing"
                            value={formData.movie_timing}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>                   
                </div>
                <button type="submit" className='w-100 btn btn-success p-3'>Add Theater</button>
            </form>
        </div>
    </div>
  )
};

export default AddTheater;
