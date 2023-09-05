import "./Home.css"
import MovieList from "../../components/MovieList/MovieList";
import Banner from "./Banner/Banner";
import LoginFormModel from "../../components/LoginFormModel/LoginFormModel";
import PopularMovies from "../../components/PopularMovies/PopularMovies";
import { useState, useContext } from "react";
import Filter from "../../components/Filter/Filter";
import MyContext from "../../MyContext";
import Footer from "../../components/Footer/Footer";

const Home = () => {
    const [searchText, setSearchText] = useState("")
    const [searchVal, setSearchVal] = useState("");
    const {filters} = useContext(MyContext);
    
    const handleChange = (e) =>{
        setSearchText(e.target.value)
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        setSearchVal(searchText);

    }
    return (
        <>
            <LoginFormModel/>
            <Banner/>
            <div className="container-fluid movie-app p-0">                   
                <div className="p-3">                     
                    <MovieList category={'top_rated'} text={'TOP RATED'}/>          
                </div>         
            </div> 

            {/* Search bar     */}
            <div className="container-fluid mt-5 mx-0 p-0">
                <div className="w-50 mx-auto">
                    <form className="d-flex justify-content-center align-items-center p-4" onSubmit={handleSubmit}>
                        
                        <input
                        type="text"
                        name="searchpanel"
                        id="searchpanel"
                        placeholder='Search Movie...'
                        className='search-panel form-control p-3'
                        value={searchText}
                        onChange={handleChange}
                        />
                       
                        <button type="submit" className="btn btn-primary mb-2 search-btn">Search</button>
                    </form>
                </div>                   
            </div>

            <div className="row p-0 m-0">
                <div className="col-2 filters p-0 m-0">
                    <Filter />         
                </div>
                <div className="col p-0">                   
                    <div className="">
                        <PopularMovies searchVal={searchVal} filters={filters}/>
                    </div>

                </div>
            </div>
           <Footer/>
            
        </>
       
    )
}

export default Home