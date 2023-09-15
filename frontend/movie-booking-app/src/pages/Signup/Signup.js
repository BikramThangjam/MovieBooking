
import { useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css"
import {Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { APIURL } from "../../components/API/utils";


const SignupSchema = Yup.object().shape({
    name: Yup.string()
            .required("Name cannot be blank")
            .min(3,'Must be atleast 3 characters long.')
            .max(25,'Name is too long!'),

    username: Yup.string()
            .required('Username cannot be blank!')
            .matches(/^[A-Za-z][A-Za-z0-9_]+$/, "Invalid username.")
            .min(3,'Must be atleast 3 characters long.')
            .max(25,'Username too long!'),

    email: Yup.string()
            .email()
            .required('Email cannot be blank!'),
  
    password: Yup.string()
            .required('Password cannot be blank!')
            .matches(
                /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                "Password must contain at least 8 characters, one uppercase, one number and one special case character."
            )
            .max(20,'Password too long!'),

    confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Password does not match'),

    isChecked: Yup.bool()
            .oneOf([true], 'You need to accept the terms & conditions'),

  });

const Signup = ()=>{
    const navigate = useNavigate();
    const [responseData, setResponseData] = useState({
        responseText: "" ,
        responseClass: "",
    });

    const [initialFormValues] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        isChecked: false
      })
    

      const handleFormSubmit = async (values, { setSubmitting, setStatus }) => {
        const formData = {
            name: values.name,
            username: values.username,
            email: values.email,
            password: values.password
        }

        try {
            // Setting isSubmitting to true to indicate the submission is starting
            setSubmitting(true);

            const response = await fetch(`${APIURL}users/signup/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
    
          const data = await response.json();
          
          if (response.ok) {

            setResponseData({
                responseText: `${data.message}. Redirecting to login page...`,
                responseClass: "alert alert-success"
            });
            
            setTimeout(()=>{
                navigate("/login")
            },2000)
            
            // Clear any previous errors
            setStatus(null);
          } else {
            console.log("response: ", response)
            console.log('Signup failed:', data);
            setStatus(data.message || 'An error occurred');

          }
        } catch (error) {
          console.error('Network error:', error);
          setStatus('An error occurred');
        }
    
        setSubmitting(false);
      };
    

    return (
        <div className="signup-form row">
            <div className="col-4"></div>
            <div className="col-4">
                <div className="grid">
                    <div className={responseData.responseClass } role="alert">
                            {responseData && responseData.responseText}
                    </div>
                    <h2 style={{color:"black"}} className="text-center mb-5 gradient-text">REGISTER</h2>
                    <Formik validationSchema={SignupSchema}  initialValues={initialFormValues} onSubmit={handleFormSubmit}>
                        {
                            ({errors,touched, isSubmitting, status})=>(
                                <Form action="#" method="#" className="form signup">
                                    <div>
                                        <div className="form__field">
                                            <div className="form__field2">
                                                <label htmlFor="signup__name">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                                                    </svg>
                                                </label>
                                                <Field id="signup__name" type="text" name="name"  className="form__Field" placeholder="Full Name" required />
                                            </div>
                                            <div className="error ms-3">{errors.name && touched.name ? errors.name : null}</div>
                                        </div>
                                       
                                    </div>
                                    <div>
                                        <div className="form__field">
                                            <div className="form__field2">
                                                <label htmlFor="signup__username">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                                                    </svg>
                                                </label>
                                                <Field id="signup__username" type="text" name="username" className="form__Field" placeholder="Username" required/>
                                            </div>
                                            <div className="error ms-3">{errors.username && touched.username ? errors.username : null}</div>
                                        </div>
                                        
                                    </div>
                                    <div>
                                        <div className="form__field">
                                            <div className="form__field2">
                                                <label htmlFor="signup__email">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-fill" viewBox="0 0 16 16">
                                                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                                                    </svg>
                                                </label>
                                                <Field id="signup__email" type="email" name="email" className="form__Field" placeholder="Email" required/>                    
                                            </div>
                                            <div className="error ms-3">{errors.email && touched.email ? errors.email : null}</div>
                                        </div>
                                        
                                    </div>
                                    <div>
                                        <div className="form__field">
                                            <div className="form__field2">
                                                <label htmlFor="signup__password">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
                                                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                                                    </svg>
                                                </label>
                                                <Field id="signup__password" type="password" name="password" className="form__Field" placeholder="Password" required/>
                                            </div>
                                            <div className="error ms-3">{errors.password && touched.password ? errors.password : null}</div>
                                        </div>
                                        
                                    </div>
                                    <div>
                                        <div className="form__field">
                                            <div className="form__field2">
                                                <label htmlFor="signup__confirmPassword">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
                                                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                                                    </svg>
                                                </label>
                                                <Field id="signup__confirmPassword" type="text" name="confirmPassword"  className="form__Field" placeholder="Confirm Password" required/>
                                            </div>
                                            <div className="error ms-3">{errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : null}</div>
                                        </div>
                                        
                                    </div>
                                    <div>
                                        <div className="form__field">
                                            <div className="form__field2">
                                                <Field type="checkbox" name="isChecked" className="me-2"/>
                                                <span style={{ marginLeft:"1.2rem"}}>I agree to the terms & conditions</span>
                                            </div>                                            
                                            {errors.isChecked && <div className="error ms-3">{errors.isChecked}</div>}
                                        </div>                                       
                                        
                                    </div>
                                    <div>
                                            <div>
                                                {status && <div className="error text-center pb-2">{status}</div>}
                                            </div>
                                        
                                            <div className="form__field2">
                                                <Field 
                                                    type="submit" 
                                                    disabled={isSubmitting} 
                                                    value="SIGN UP"
                                                    className={isSubmitting ? 'submit-button-disabled' : 'submit-button'}
                                                    />
                                            </div>
                                        
                                    </div>
                                    <p className="text--center">Already have an account? <Link to="/login">Login here</Link> </p>
                                    
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

export default Signup;