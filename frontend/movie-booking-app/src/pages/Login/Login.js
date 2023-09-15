import { Link, useNavigate } from "react-router-dom";
import "./Login.css"
import {Formik, Form, Field} from "formik";
import * as Yup from "yup";
import { useState, useContext } from "react";
import MyContext from "../../MyContext";
import { APIURL } from "../../components/API/utils";

const LoginSchema = Yup.object().shape({
    username: Yup.string()
            .required('Username cannot be blank.')
            .matches(/^[A-Za-z][A-Za-z0-9_]+$/, "Invalid username.")
            .min(3,'Must be atleast 3 characters long.')
            .max(25,'Username too long!'),
    
    password: Yup.string()
            .required('Password cannot be blank.')


  });

const Login = ()=>{
    const {setIsLoggedIn} = useContext(MyContext);
    const [responseData, setResponseData] = useState({
        responseText: "" ,
        responseClass: "",
    });

    const navigate = useNavigate()

    const [initialFormValues] = useState({
        username: "",
        password: ""
      })

    const handleFormSubmit = async (values, { setSubmitting, setStatus }) => {
        const formData = {           
            username: values.username,
            password: values.password
        }
        try {
            // Setting isSubmitting to true to indicate the submission is starting
            setSubmitting(true);

            const response = await fetch(`${APIURL}auth/login/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
    
          const data = await response.json();
          
          if (response.ok) {
            localStorage.setItem("refresh", data.refresh)
            localStorage.setItem("access", data.access)

            const user = data.data;
            if (user.is_staff === true && user.is_superuser === true){
                localStorage.setItem("isAdmin",true)
            }else{
                localStorage.setItem("isAdmin",false)
            }
            setResponseData({
                responseText: "Login successful. Redirecting...",
                responseClass: "alert alert-success"
            });
            
            setTimeout(()=>{
                setIsLoggedIn(true)
                navigate("/");
            },2000)
            // Clear any previous errors
            setStatus(null);
          } else {
            // console.log("response: ", response)
            // console.log('Signup failed:', data);
            setStatus(data.message || 'An error occurred');

          }
        } catch (error) {
          console.error('Network error:', error);
          setStatus('An error occurred');
        }
    
        setSubmitting(false);
      }

    return (
        <div className="login-form row">
            <div className="col-4"></div>
            <div className="col-4">
                <div className="grid">
                    <div className={responseData.responseClass} role="alert">
                        { responseData && responseData.responseText}
                    </div>
                    <Formik validationSchema={LoginSchema}  initialValues={initialFormValues} onSubmit={handleFormSubmit}>
                        {
                            ({errors,touched, isSubmitting, status})=>(
                                <Form action="#" method="#" className="form login pt-2">
                                    <h5 style={{color:"#33338a", paddingBottom:"5px"}}>Hello</h5>
                                    <h2 style={{color:"#545466", fontWeight:"bold"}} className='mb-4 gradient-text'>WELCOME BACK</h2>
                                    <div>
                                        <div className="form__field">
                                            <div className="form__field2">
                                                <label htmlFor="login__username">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                                                    </svg>
                                                </label>
                                                <Field id="login__username" type="text" name="username" className="form__Field" placeholder="Username" required/>
                                            </div>
                                            <div className="error ms-3">{errors.username && touched.username ? errors.username : null}</div>
                                        </div>
                                        
                                    </div>
                                    
                                    <div>
                                        <div className="form__field">
                                            <div className="form__field2">
                                                <label htmlFor="login__password">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
                                                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                                                    </svg>
                                                </label>
                                                <Field id="login__password" type="password" name="password" className="form__Field" placeholder="Password" required/> 
                                            </div>
                                            <div className="error ms-3">{errors.password && touched.password ? errors.password : null}</div>
                                        </div>
                                        
                                    </div>
                            
                                    <div>
                                        <div>
                                            {status && <div className="error text-center pb-2">{status}</div>}
                                        </div>                                      
                                        <div className="form__field2">
                                            <Field 
                                            type="submit" 
                                            value="Login"
                                            disabled={isSubmitting} 
                                            className={isSubmitting ? 'submit-button-disabled' : 'submit-button'}
                                            />
                                        </div>                                       
                                    </div>
                                    <p className="text--center">Don't have an account? <Link to="/signup" >Sign up here</Link> </p>
                                </Form>
                            )
                        }
                    </Formik>
                    
                    
                </div>     
            </div>
            <div className="col-4"></div>
        </div >
    )
}

export default Login;