import { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PopularMovie from "./PopularMovie/PopularMovie";

const PopularMovies = (props) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getMoviesReq = async () => {
    setIsLoading(true)
    const url = `http://127.0.0.1:8000/api/movies/filters/byTitle/?${props.searchVal ? "title=" + props.searchVal : ""}&page=${currentPage}`;
    const res = await fetch(url);
    // console.log("response ", res)

    if(res.ok){
      const data = await res.json();
      // console.log("data ", data)
      
      setIsLoading(false)
      setMovies(data.data);
      setTotalPages(data.total_pages);
    }else{
      console.error("Failed to fetch movies data ")
    }
    
  };

  useEffect(() => {
    getMoviesReq();
  }, [props.searchVal, currentPage]);

  const Loading = () => {
    const renderSkeletons = () => {
      const skeletons = [];
      for (let i = 0; i < 12; i++) {
        skeletons.push(
          <div className="" key={i}>
            <SkeletonTheme baseColor="#04051c" highlightColor="#0b0d29">
              <div className="col-12 col-xl-3 col-md-4 col-sm-6 mb-3">
                <Skeleton height={300} width={175} />
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
  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <div className="row">
        {
            isLoading 
            ? 
            <Loading />
            : 
            movies.map((movie, index) => <PopularMovie movie={movie} key={index} />)
        }
      </div>
      <div className="d-flex justify-content-center mt-3">
        <nav aria-label="Page navigation">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="Next"
              >
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>      
    </div>
  );
};

export default PopularMovies;
