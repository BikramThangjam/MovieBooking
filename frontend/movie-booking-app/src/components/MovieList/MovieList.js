import { useEffect, useState, useRef } from "react";
import Movie from "./Movie/Movie";
import "./MovieList.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { APIURL } from "../API/utils";

const MovieList = (props) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const carouselContainer = useRef();

  const navigation = (dir) => {
    const container = carouselContainer.current;

    const scrollAmount =
        dir === "left"
            ? container.scrollLeft - (container.offsetWidth)
            : container.scrollLeft + (container.offsetWidth);

    container.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
    });
};

  const getMoviesReq = async () => {
    const url = `${APIURL}movies/filters/byCategory/?cat=${props.category}`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data){
      setIsLoading(false)
    }
    setMovies(data.data);
  };

  useEffect(() => {
    getMoviesReq();
  }, []);

  const Loading = () => {
    const renderSkeletons = () => {
      const skeletons = [];
      for (let i = 0; i < 10; i++) {
        skeletons.push(
          <div className="d-flex justify-content-start mt-3 me-3" key={i}>
            <SkeletonTheme baseColor="#04051c" highlightColor="#0b0d29">
              <div className="col-12 col-xl-3 col-md-4 col-sm-6 mb-3">
                <Skeleton height={250} width={170} />
              </div>
            </SkeletonTheme>
          </div>
        );
      }
      return skeletons;
    }
    
    return (
      <>
        {renderSkeletons()}
      </>    
    )
  };

  return (
    <>
      <p className="movie-cat mb-0 mt-5">{props.text}</p>
      <div className="position-relative">
        <BsFillArrowLeftCircleFill
                  className="carouselLeftNav arrow"
                  onClick={() => navigation("left")}
              />
        <BsFillArrowRightCircleFill
                  className="carouselRighttNav arrow"
                  onClick={() => navigation("right")}
        />
        <div className="row" ref={carouselContainer}>
            {
                isLoading 
                ? 
                <Loading />
                : 
                movies.map((movie, index) => <Movie movie={movie} key={index} />)
            }
          </div>
      </div>
      
    </>
  );
};

export default MovieList;
