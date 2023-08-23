import {useEffect, useState} from 'react'
import Movie from './Movie/Movie'

const MovieList = (props) => {
    const [movies, setMovies] = useState([]) 

    const getMoviesReq = async () => {
        const url = `http://127.0.0.1:8000/api/movies/filters/byCategory/?cat=${props.category}`;
        const res = await fetch(url);
        const data = await res.json();
        // console.log(data.data)
        setMovies(data.data)
    }

    useEffect(()=>{
        getMoviesReq();
    },[])
    return (
        <>
            <h5 className="movie-cat mb-0 mt-3">{props.text}</h5> 
            <div className="row">
                {movies.map((movie, index)=> (
                    <Movie movie = {movie} key={index}/>
                ))}
            </div>            
        </>
    )
}

export default MovieList