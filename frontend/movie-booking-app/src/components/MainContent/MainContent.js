import "./MainContent.css"
import jsondata from "./data.json"
import MovieList from "../MovieList/MovieList"
import { useState } from "react"
import { Link } from "react-router-dom"
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
const MainContent = () => {
   const [popularMovies, setPopularMovies] = useState(jsondata)
    return (
        <div className="container movie-app">
            {/* <div className="poster">
                <Carousel
                    showThumbs={false}
                    autoPlay={true}
                    transitionTime={3}
                    infiniteLoop={true}
                    showStatus={false}
                >
                    {popularMovies.map(movie=>(
                        <Link style={{textDecoration:"none",color:"white"}} to={`/movie/${movie.id}`} >
                        <div className="posterImage">
                            <img src={`https://image.tmdb.org/t/p/original${movie && movie.backdrop_path}`} />
                        </div>
                        <div className="posterImage__overlay">
                            <div className="posterImage__title">{movie ? movie.original_title: ""}</div>
                            <div className="posterImage__runtime">
                                {movie ? movie.release_date : ""}
                                <span className="posterImage__rating">
                                    {movie ? movie.vote_average :""}
                                    <i className="fas fa-star" />{" "}
                                </span>
                            </div>
                            <div className="posterImage__description">{movie ? movie.overview : ""}</div>
                        </div>
                    </Link>
                    ))}    

                </Carousel>
            </div> */}
                    
            <MovieList category={'upcoming'} text={'UPCOMING'}/>                
            <MovieList category={'recommended'}  text={'RECOMMENDED'}/>      
            <MovieList category={'most_rated'} text={'MOST RATED'}/>          
        </div>
    )
}

export default MainContent