import "./Filters.css";

const Filters = () => {
  return (
    <>
      <h4 className="text-center mb-3">Filters</h4>
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
              placeholder="Enter genre..."
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
              placeholder="Enter language (en, es, ja)..."
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
              placeholder="Enter city name..."
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
              placeholder="Enter rating (PG, PG-13, R)..."
            />
          </div>
        </li>
      </ul>
    </>
  );
};

export default Filters