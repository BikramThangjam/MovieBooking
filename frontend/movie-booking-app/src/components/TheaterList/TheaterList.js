import "./TheaterList.css";
import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import MyContext from "../../MyContext";

const TheaterList = () => {
  const { movie_id } = useParams();
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const { summary, setSummary } = useContext(MyContext);

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/theaters/${movie_id}/`);
        const data = await response.json()
        if(response.ok){
            setTheaters(data);
            setLoading(false);
        }
        
      } catch (error) {
        console.error("Error fetching theaters:", error);
      }
    };

    fetchTheaters();
  }, [movie_id]);

  const formatMovieTiming = (timing)=>{

    const dateTimeString = timing;
    const dateTime = new Date(dateTimeString);

    const dateFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      
      const timeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
      };
      
      const formattedDate = dateTime.toLocaleDateString('en-US', dateFormatOptions);
      const formattedTime = dateTime.toLocaleTimeString('en-US', timeFormatOptions);
      
    return `${formattedTime}, ${formattedDate}`
  }

  const handleClick = (theater)=>{
    const updatedObj = {
      ...summary, 
      theater: {
        theater_id: theater.id,
        theater_name: theater.name
      },
      startTime: formatMovieTiming(theater.movie_timing)
    }
    setSummary(updatedObj)
  }

  return (
    <div>
      <h2 className="text-center display-3 pb-4">Available Theaters</h2>
      {loading ? (
        <p className="text-center" style={{color: "white"}}>Loading...</p>
      ) : (
        <div className="container">
            <table class="table table-hover table-dark" style={{maxWidth:"800px", margin:"auto"}}>
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Theater Name</th>
                    <th scope="col">City</th>
                    <th scope="col" >Timing</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        theaters.map((theater, index) => (
                            <tr key={theater.id}>
                                <th className="pt-3" scope="row">{index+1}</th>
                                <td className="pt-3">{theater.name}</td>
                                <td className="pt-3">{theater.city}</td>
                                <td >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <span>{formatMovieTiming(theater.movie_timing)}</span>
                                    <span><Link style={{textDecoration: "none"}} to={`/theater/${theater.id}/movie/${movie_id}`} className="btn btn-info" onClick={e=>handleClick(theater)}>Book Seat</Link></span>
                                  </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
};

export default TheaterList;