import "./Movie.css"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"

const Movie = ({movie}) => {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 1500)
    }, [])

    return (
        <>
            {
                isLoading 
                ? 
                <div className="cards d-flex justify-content-start m-3">
                    <SkeletonTheme baseColor="#202020" highlightColor="#444">
                        <Skeleton height={300} duration={2} />
                    </SkeletonTheme>
                </div>                       
                :
                <Link style={{textDecoration:"none",color:"white"}} className="image-container d-flex justify-content-start m-3" to={`/movie/${movie.id}`}>
                    <img src={movie.image} alt='movie'/>
                    <div className="overlay d-flex align-items-center justify-content-center">BOOK NOW</div>
                </Link>
            }
        
        </>
        
    )
}

export default Movie