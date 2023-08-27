import "./Movie.css"
import { Link } from "react-router-dom"


const Movie = ({movie}) => {
    const movie_id = movie.id
    console.log("movie_id--", movie_id)
    return (
        <>
            <Link style={{ color: 'white', textDecoration: 'none' }} className="image-container d-flex justify-content-start m-3" to={`/movie/${movie_id}` }>
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