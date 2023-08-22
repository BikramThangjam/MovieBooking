import {useEffect, useState} from 'react'
import "./MovieList.css"

const MovieList = (props) => {
    const [movies, setMovies] = useState([])
    const getMoviesReq = async () => {
        const url = `http://127.0.0.1:8000/api/movies/filters/byCategory/?cat=${props.category}`;
        const res = await fetch(url);
        const data = await res.json();
        console.log(data.data)
        setMovies(data.data)
    }

    useEffect(()=>{
        getMoviesReq();
    },[])
    return (
        <>
            <div className="row">
                {movies.map((movie, index)=> (
                    <div className="image-container d-flex justify-content-start m-3">
                        <img src={movie.image} alt='movie'/>
                        <div className="overlay d-flex align-items-center justify-content-center">BOOK NOW</div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default MovieList