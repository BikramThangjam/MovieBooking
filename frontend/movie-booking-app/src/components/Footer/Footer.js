import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    return (

        <footer className="text-center footer-bg">

            <div className="container">

                <section >

                    <div className="row text-center d-flex justify-content-center pt-5">

                        <div className="col-md-2 col-sm-2 col-xs-6">
                            <h6 className="text-uppercase font-weight-bold">
                                <Link to="#" className="text-white footer-link">About us</Link>
                            </h6>
                        </div>

                        <div className="col-md-2 ">
                            <h6 className="text-uppercase font-weight-bold">
                                <Link to="#" className="text-white footer-link">Awards</Link>
                            </h6>
                        </div>



                        <div className="col-md-2 ">
                            <h6 className="text-uppercase font-weight-bold">
                                <Link to="#" className="text-white footer-link">Help</Link>
                            </h6>
                        </div>



                        <div className="col-md-2">
                            <h6 className="text-uppercase font-weight-bold">
                                <Link to="#" className="text-white footer-link">Contact</Link>
                            </h6>
                        </div>

                    </div>

                </section>


                <hr className="my-4 bg-light" />


                <section className="mb-3">
                    <div className="row d-flex justify-content-center">
                        <div className="col-lg-8">
                            <p className="text-light">
                            Welcome to BOLETO, your premier destination for hassle-free movie bookings! At BOLETO, we're passionate about enhancing your cinema experience. Our user-friendly platform allows you to effortlessly browse movie listings, select your preferred showtimes, and secure tickets in a few clicks. With a commitment to convenience and top-notch service, BOLETO is your trusted partner for memorable movie nights. Join us in exploring the world of cinema, one ticket at a time. Your entertainment journey starts here, at BOLETO.
                            </p>
                        </div> 
                    </div>
                </section>



                <section className="mb-3 d-flex justify-content-center ">
                    <Link to="#" className="text-color me-4">
                        <i className="fab fa-facebook-f"></i>
                    </Link>
                    <Link to="#" className="text-color me-4">
                        <i className="fab fa-twitter"></i>
                    </Link>
                    <Link to="#" className="text-color me-4">
                        <i className="fab fa-google"></i>
                    </Link>
                    <Link to="#" className="text-color me-4">
                        <i className="fab fa-instagram"></i>
                    </Link>
                    <Link to="#" className="text-color me-4">
                        <i className="fab fa-linkedin"></i>
                    </Link>
                    <Link to="#" className="text-color me-4">
                        <i className="fab fa-github"></i>
                    </Link>
                </section>

            </div>

            <div className=" p-3 d-flex justify-content-around footer-end">
                <span className="fw-bold text-light">© 2023 Copyright </span> 
                <Link className="text-white fs-6 " to="/">  BOLETO.com</Link>
            </div>

        </footer>

    )
}

export default Footer;