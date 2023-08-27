import { useEffect, useState } from "react";
import Movie from "./Movie/Movie";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const MovieList = (props) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMoviesReq = async () => {
    const url = `http://127.0.0.1:8000/api/movies/filters/byCategory/?cat=${props.category}`;
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
                <Skeleton height={300} width={200} />
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
      <h5 className="movie-cat mb-0 mt-3">{props.text}</h5>

      <div className="row">
        {
            isLoading 
            ? 
            <Loading />
            : 
            movies.map((movie, index) => <Movie movie={movie} key={index} />)
        }
      </div>
    </>
  );
};

export default MovieList;
