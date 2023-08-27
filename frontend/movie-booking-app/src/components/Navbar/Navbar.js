
import { Link } from "react-router-dom"
import "./Navbar.css"
const Navbar = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark nav-bg">
                <Link className="navbar-brand" to="/">BOLETO</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to="/dashboard">Dashboard <span className="sr-only">(current)</span></Link>
                        </li>
                    </ul>
                    <Link style={{textDecoration: "none", color: "white"}} type="button" className="join-btn" to={"/signup"}>Join Us</Link>
                </div>
            </nav>

        </>
    )
}

export default Navbar