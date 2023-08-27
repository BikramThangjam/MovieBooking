import React, {useEffect, useState, useContext} from "react"
import "./MovieDetail.css"
import { Link, useParams } from "react-router-dom"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import MyContext from "../../MyContext";
const MovieDetail = () => {
    const [movieDetail, setMovieDetail] = useState()
    const { movie_id } = useParams()
    const { summary, setSummary } = useContext(MyContext);
    console.log("Movie details of id--", movie_id)
    useEffect(() => {
        getDetails()
        window.scrollTo(0,0) //once page is loaded, scroll to top
    }, [])

    const getDetails = async () => {
        const res = await fetch(`http://127.0.0.1:8000/api/movies/${movie_id}/`)
        const data = await res.json()
        setMovieDetail(data)
    }

    const handleClick = ()=>{
        const updatedObj = {
            ...summary,
            movie: {
                movie_id,
                movie_name: movieDetail.title
            }
        }

        setSummary(updatedObj)
    }
    
    return (
        <SkeletonTheme baseColor="#04051c" highlightColor="#0b0d29">
            <div className="container-fluid movie">
                <div className="movie__intro">
                    {   
                        movieDetail 
                        ? <img className="movie__backdrop" src={movieDetail.image} /> 
                        : <Skeleton height={500}/> 
                    }
                </div>
                <div className="movie__detail">
                    <div className="movie__detailLeft">
                        <div className="movie__posterBox">
                            {
                                movieDetail
                                ? <img className="movie__poster" src={movieDetail.image} />
                                : <Skeleton width={300} height={400}/>
                            }
                            
                        </div>
                    </div>
                    <div className="movie__detailRight">
                        <div className="movie__detailRightTop">
                            <div className="movie__name">{movieDetail ? movieDetail.title : ""}</div>
                            <div className="movie__rating">
                                {movieDetail ? movieDetail.rating: ""} <i className="fas fa-star" />
                                <span className="movie__voteCount">{movieDetail ? "(" + movieDetail.votes + ") votes" : ""}</span>
                            </div>  
                            <div className="movie__runtime">{movieDetail ? movieDetail.movie_length + " mins" : ""}</div>
                            <div className="movie__releaseDate">{movieDetail ? "Release date: " + movieDetail.release_date : ""}</div>
                            <div className="movie__genres">
                                {
                                    movieDetail && movieDetail.genre
                                    ? 
                                    movieDetail.genre.map(gen => (
                                        <><span className="movie__genre" id={gen.id}>{gen.name}</span></>
                                    )) 
                                    : 
                                    ""
                                }
                            </div>
                        </div>
                        <div className="movie__detailRightBottom">
                            <div className="synopsisText">Description</div>
                            {
                                movieDetail
                                ? <div>{movieDetail.description}</div>
                                : <div className="mt-5"><Skeleton count={3} width={800} height={25}/></div>
                            }
                            
                            <div className="d-flex justify-content-center mt-3">
                                {
                                    movieDetail
                                    ? <Link style={{textDecoration: "none", color: "white"}} class="mybtn book-btn text-center" to={`/theater/${movie_id}`} onClick={handleClick}>BOOK TICKETS</Link>
                                    : <Skeleton width={300} height={50}/>
                                }
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>    
        </SkeletonTheme>
    )
}

export default MovieDetail