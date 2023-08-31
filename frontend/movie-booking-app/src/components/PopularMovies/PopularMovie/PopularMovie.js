import "./PopularMovie.css";
import { Link } from "react-router-dom";


const PopularMovie = ({movie}) => {
    const movie_id = movie.id
    // console.log("movie_id--", movie_id)
    return (
        <>
            <Link style={{ color: 'white', textDecoration: 'none' }} className="card p-0 border-0 card-main col-2 mx-2 mb-3" to={`/movie/${movie_id}` }>
                    <div className="overlay-top text-white text-center">                         
                            {movie && movie.title}                       
                    </div>
                    <img src={movie.image} alt='movie'/>
                    <div className="overlay d-flex align-items-center justify-content-between">
                        <span>
                            {movie ? movie.rating : ""}{" "}
                            <i className="fas fa-star" />
                        </span>
                        <span>
                            <i className="fas fa-thumbs-up"></i>{" "}   
                            {movie ? movie.votes: ""}
                        </span>

                    </div>
            </Link>
         
        </>
        
    )
}

export default PopularMovie