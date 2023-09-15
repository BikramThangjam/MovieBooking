import { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PopularMovie from "./PopularMovie/PopularMovie";
import { APIURL } from "../API/utils";

const PopularMovies = (props) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const {searchVal, filters} = props

  const getMoviesReq = async () => {

    setIsLoading(true)

    const searchTxt = `${searchVal ? "title=" + searchVal : ""}`;
    const genreTxt = `${filters.genre ? "&genre=" + filters.genre : ""}`;
    const langTxt = `${filters.language ? "&lan=" + filters.language : ""}`;
    const locTxt = `${filters.location ? "&city=" + filters.location : ""}`;
    const ratingTxt = `${filters.rating ? "&rating=" + filters.rating : ""}`

    const url = `${APIURL}movies/filters/?${searchTxt}${genreTxt}${langTxt}${locTxt}${ratingTxt}&page=${currentPage}`;
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
  }, [searchVal, filters, currentPage]);

  const Loading = () => {
    const renderSkeletons = () => {
      const skeletons = [];
      for (let i = 0; i < 12; i++) {
        skeletons.push(
          <div className="" key={i}>
            <SkeletonTheme baseColor="#04051c" highlightColor="#0b0d29">
              <div className="col-12 col-xl-3 col-md-4 col-sm-6 mb-3">
                <Skeleton height={250} width={175} />
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
            movies.length > 0 ? (
              movies.map((movie, index) => (
                <PopularMovie movie={movie} key={index} />
                ))
              ) : (
                <div className=" no-results w-100 d-flex justify-content-center align-items-center">
                  <h4 className="text-white">No results found!</h4>
                </div>
              )
        }
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">
        <nav aria-label="Page navigation ">
          <ul className="pagination ">
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
