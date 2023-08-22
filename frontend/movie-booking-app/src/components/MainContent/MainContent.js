import "./MainContent.css"
import MovieList from "../MovieList/MovieList"
const MainContent = () => {
   
    return (
        <div className="container-fluid movie-app">
            <h5 className="movie-cat mb-0 mt-3">UPCOMING</h5>         
            <MovieList category={'upcoming'}/>
            <h5 className="movie-cat mb-0 mt-3">RECOMMENDED</h5>                
            <MovieList category={'recommended'}/> 
            <h5 className="movie-cat mb-0 mt-3">MOST RATED </h5>      
            <MovieList category={'most_rated'}/>          
        </div>
    )
}

export default MainContent