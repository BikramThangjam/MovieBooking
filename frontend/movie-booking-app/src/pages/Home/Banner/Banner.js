import "./Banner.css";
import { Link } from "react-router-dom";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import jsondata from "./data.json"
import { useState } from "react"

const Banner = () => {   
    const [popularMovies, setPopularMovies] = useState(jsondata)
  return (
    <div className="banner">
      <Carousel
        showThumbs={false}
        autoPlay={true}
        transitionTime={3}
        infiniteLoop={true}
        showStatus={false}
      >
        {popularMovies.map((movie, i) => (
          <div key={i}>
            <div className="bannerImage">
              <img src={`https://image.tmdb.org/t/p/original${movie && movie.backdrop_path}`}/>
            </div>
            <div className="bannerImage__overlay">
              <div className="bannerImage__title">
                {movie ? movie.original_title : ""}
              </div>
              <div className="bannerImage__runtime">
                {movie ? movie.release_date : ""}
                <span className="bannerImage__rating">
                  {movie ? movie.vote_average : ""}
                  <i className="fas fa-star" />{" "}
                </span>
              </div>
            </div>
            <div className="banner-text">
                <h1>BOOK YOUR <span style={{color: "rgb(236, 94, 113)"}}>MOVIE</span> TICKETS TODAY!!!</h1>
                <p>Experience the thrill of the big screen with the latest blockbusters.</p>             
            </div> 
          </div>
        ))}
                  
      </Carousel>
        
    </div>
  );
};

export default Banner;
