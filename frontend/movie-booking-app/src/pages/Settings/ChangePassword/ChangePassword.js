import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithToken } from "../../../components/API/Interceptor";
import "../../../components/ReusableProfile/ReusableProfile.css";
import "./ChangePassword.css";
import profileImg from "../../../images/profile-icon.png";
import bgImgURL from "../../../images/profile-bg-1.jpg";
import { APIURL } from "../../../components/API/utils";

const ChangePassword = () => {
  const [token, setToken] = useState();
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [credential, setCredential] = useState({
    password: "",
    confirmPassword: "",
  });
  const [responseData, setResponseData] = useState({
    responseText: "",
    responseClass: "",
  });
  let navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("access");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredential((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (credential.password === credential.confirmPassword) {
      setPasswordsMatch(true);
      const apiUrl = `${APIURL}users/profile/update/`;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const options = {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({
            password: credential.password
        }),
      };

      try {
        const response = await fetchWithToken(apiUrl, options);
        const data = await response.json();
        if (response.ok) {
          setResponseData({
            responseText: "Password has been changed",
            responseClass: "alert alert-success",
          });

          setTimeout(() => {
            navigate("/settings");
          }, 2000);
        } else {
          console.error("Failed to fetch data");
          console.log("error: ", data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      setPasswordsMatch(false);
    }
  };

  return (
    <>
      <div className="container">
        <div className="padding">
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <div className="card card-shadow">
                <img
                  src={bgImgURL}
                  alt="CartImageCap"
                  className="card-img-top"
                />
                <div className="card-body text-center little-profile">
                  <div className="pro-img">
                    <img src={profileImg} alt="user" />
                  </div>
                  <div className="  mb-3 "></div>
                  <div className="w-100 mx-auto">
                    <form onSubmit={handleSubmit}>
                      <div className="form-group row">
                        <label
                          htmlFor="password"
                          className="col-sm-5 col-form-label col-form-label-sm text-dark"
                        >
                          New Password
                        </label>
                        <div className="col-sm-7">
                          <input
                            type="password"
                            name="password"
                            value={credential.password}
                            className="form-control form-control-sm"
                            onChange={handleChange}
                            placeholder="Enter new password"
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label
                          htmlFor="confirmPassword"
                          className="col-sm-5 col-form-label col-form-label-sm text-dark"
                        >
                          Confirm Password
                        </label>
                        <div className="col-sm-7">
                          <input
                            type="text"
                            name="confirmPassword"
                            value={credential.confirmPassword}
                            className="form-control form-control-sm"
                            onChange={handleChange}
                            placeholder="Confirm new password"
                            required
                          />
                        </div>
                      </div>
                      {!passwordsMatch && (
                        <div className="error">Password do not match.</div>
                      )}
                      <div className={responseData.responseClass} role="alert">
                            { responseData && responseData.responseText}
                        </div>
                      <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-success">
                          Save
                        </button>
                      </div>
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
  );
};

export default ChangePassword;
