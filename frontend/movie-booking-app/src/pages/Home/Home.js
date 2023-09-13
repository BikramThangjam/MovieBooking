import "./Home.css"
import MovieList from "../../components/MovieList/MovieList";
import Banner from "./Banner/Banner";
import LoginFormModel from "../../components/LoginFormModel/LoginFormModel";
import PopularMovies from "../../components/PopularMovies/PopularMovies";
import { useState, useContext, useEffect, useRef } from "react";
import Filter from "../../components/Filter/Filter";
import MyContext from "../../MyContext";
import Footer from "../../components/Footer/Footer";

const Home = () => {
    const [searchText, setSearchText] = useState("")
    const [searchVal, setSearchVal] = useState("");
    const {filters,isModalVisible, setIsModalVisible} = useContext(MyContext);
    const buttonRef = useRef(null);

    const handleChange = (e) =>{
        setSearchText(e.target.value)
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        setSearchVal(searchText);

    }

    useEffect(()=>{
        let token = localStorage.getItem('access');

        if(!token){
            // Automatically show the modal when the user is not logged in
            setIsModalVisible(true);
            if(buttonRef.current){
                // console.log("buttonRef--",buttonRef)
                // console.log("button clicked..")
                buttonRef.current.click()  
            }
            
            //                
        }

    },[isModalVisible])

    return (
        <>
            {isModalVisible && <LoginFormModel buttonRef={buttonRef}/>}
            <Banner/>
            <div className="container movie-app p-0">                   
                <div className="px-5">                     
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

            <div className="row m-0 movie--list">
                <div className="col-2 filters p-0 m-0">
                    <Filter />         
                </div>
                <div className="col-10 px-4">                   
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