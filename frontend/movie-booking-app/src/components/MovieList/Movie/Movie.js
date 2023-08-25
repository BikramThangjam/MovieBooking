import "./Movie.css"
import { Link } from "react-router-dom"


const Movie = ({movie}) => {

    return (
        <>
            <Link style={{ color: 'white', textDecoration: 'none' }} className="image-container d-flex justify-content-start m-3" to={`/movie/${movie.id}` }>
                    <img src={movie.image} alt='movie'/>
                    <div className="overlay d-flex align-items-center justify-content-between">
                        <span>
                            {movie ? movie.rating : ""}{" "}
                            <i className="fas fa-star" />
                        </span>
                        <span>
                            <i class="fas fa-thumbs-up"></i>{" "}   
                            {movie ? movie.votes: ""}
                        </span>

                    </div>
            </Link>
         
        </>
        
    )
}

export default Movie