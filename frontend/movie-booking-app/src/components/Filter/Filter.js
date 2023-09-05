
import "./Filter.css";
import MyContext from "../../MyContext";
import { useContext, useState } from "react";

const Filter = () => {
  const {setFilters} = useContext(MyContext);
  const [localFilter, setLocalFilter] = useState({
    genre: "",
    language: "",
    location:"",
    rating:""
})
  

const handleChange= (e) => {
  const {name, value} = e.target;
  setLocalFilter(prev => {
    return {
      ...prev,
      [name]:value
    }
  })
}

const handleSubmit = e =>{
  e.preventDefault();
  setFilters(localFilter);
}
  return (
    <>
      <h4 className="text-center mb-3">Filters</h4>
      <form className="d-flex flex-column justify-content-center p-2" onSubmit={handleSubmit}>
        <ul className="filter-list">
          <li>
            <button
              className="btn btn-dark"
              type="button"
              data-toggle="collapse"
              data-target="#genreFilter"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              Genre
            </button>
            <div className="collapse" id="genreFilter">
              <input
                type="text"
                className="form-control"
                placeholder="action, adventure..."
                name="genre"
                value={localFilter.genre}
                onChange={handleChange}
              />
            </div>
          </li>
          <li>
            <button
              className="btn btn-dark"
              type="button"
              data-toggle="collapse"
              data-target="#lanFilter"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              Language
            </button>
            <div className="collapse" id="lanFilter">
              <input
                type="text"
                className="form-control"
                placeholder="en, es, ja..."
                name="language"
                value={localFilter.language}
                onChange={handleChange}
              />
            </div>
          </li>
          <li>
            <button
              className="btn btn-dark"
              type="button"
              data-toggle="collapse"
              data-target="#locFilter"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              Location
            </button>
            <div className="collapse" id="locFilter">
              <input
                type="text"
                className="form-control"
                placeholder="chennai, mumbai..."
                name="location"
                value={localFilter.location}
                onChange={handleChange}
              />
            </div>
          </li>
          <li>
            <button
              className="btn btn-dark"
              type="button"
              data-toggle="collapse"
              data-target="#ratingFilter"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              Rating
            </button>
            <div className="collapse" id="ratingFilter">
              <input
                type="text"
                className="form-control"
                placeholder="PG, PG-13, R..."
                name="rating"
                value={localFilter.rating}
                onChange={handleChange}
              />
            </div>
          </li>
        </ul>
        <button type="submit" className="btn btn-success ">GO</button>
      </form>
      
    </>
  );
};

export default Filter