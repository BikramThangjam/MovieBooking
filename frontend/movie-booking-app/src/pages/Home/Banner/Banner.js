import "./Banner.css";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import jsondata from "./data.json"
import { useState } from "react"



const Banner = () => {   
    const [popularMovies, setPopularMovies] = useState(jsondata)
  return (
    <div className="container-fluid mx-0 px-0">
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
            
            <div className="banner-text">
                <h1>BOOK YOUR <span style={{color: "rgb(236, 94, 113)"}}>MOVIE</span> TICKETS TODAY!!!</h1>
                <p style={{color: "#f09322"}}>Experience the thrill of the big screen with the latest blockbusters.</p>             
            </div> 
          </div>
        ))}
                  
      </Carousel>
        
    </div>
  );
};

export default Banner;
