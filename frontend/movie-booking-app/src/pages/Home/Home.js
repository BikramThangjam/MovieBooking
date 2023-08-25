import "./Home.css"
import MovieList from "../../components/MovieList/MovieList";
import Banner from "./Banner/Banner";

const Home = () => {
    return (
        <div className="container-fluid movie-app p-0"> 
            {/* <Banner/>                   */}
            <div className="p-3">
                <MovieList category={'now_playing'} text={'NOW PLAYING'}/>                
                <MovieList category={'upcoming'}  text={'UPCOMING'}/>      
                <MovieList category={'top_rated'} text={'TOP RATED'}/>          
            </div>         
        </div>
    )
}

export default Home