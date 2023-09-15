import React, { useState, useEffect } from 'react';
import { fetchWithToken } from '../../../API/Interceptor';
import { APIURL } from '../../../API/utils';

const AddSeat = () => {
 
    const [token, setToken] = useState();
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        theater: "",
        movie: "",
        seat_no: "",
        is_reserved: false,
        category: "regular",
        price: 0.00,
    });

    const [responseData, setResponseData] = useState({
        responseText:"",
        responseClass:""
    });

    const handleChange = (e) => {
        const { name, value, checked, type} = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleAddSeat = async (e) => {
        e.preventDefault();
        // console.log(formData);
        const apiUrl = `${APIURL}seat/add/`; 
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
                    responseText: "Seat added successfully",
                    responseClass: "alert alert-success alert-dismissible fade show"
                });
                setShow(true)
                
                setTimeout(()=>{
                    setShow(false)
                },3000)
                        
                } else {
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
            <h1 className="text-center mt-4">Add a Seat</h1>
            <hr className="bg-white w-50 mx-auto" />
            <form onSubmit={handleAddSeat} className='main-form'>
                <div className="overflow-auto seat-form">
                    <div className="form-group">
                        <label htmlFor='theater'>Theater ID:</label>
                        <input
                            type="number"
                            name="theater"
                            value={formData.theater}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
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
                        <label htmlFor='seat_no'>Seat Number:</label>
                        <input
                            type="text"
                            name="seat_no"
                            value={formData.seat_no}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <div className="">
                            <span style={{ marginRight:"1.2rem"}}>Is Reserved: </span>
                            <input 
                                type="checkbox" 
                                name="is_reserved"
                                checked={formData.is_reserved}
                                onChange={handleChange}
                            />                           
                         </div>                                      
                    </div>
                    <div className="form-group">
                        <label htmlFor='category'>Category:</label>
                        <select
                            className="form-control"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="regular">Regular</option>
                            <option value="premium">Premium</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor='price'>Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>                   
                </div>
                <button type="submit" className='w-100 btn btn-success p-3'>Add Seat</button>
            </form>
        </div>
    </div>
  )
};

export default AddSeat;
