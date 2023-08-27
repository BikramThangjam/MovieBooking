// import {useEffect, useState} from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import MovieDetail from './components/MovieDetail/MovieDetail';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import TheaterList from './components/TheaterList/TheaterList';
import SeatSelection from './components/SeatSelection/SeatSelection';
import BookingSummary from './components/BookingSummary/BookingSummary';
import MyContextProvider from './MyContextProvider';

function App() {

  return (
    <>
    <MyContextProvider>    
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="movie/:movie_id" element={<MovieDetail/>}/>
          <Route path="theater/:movie_id" element={<TheaterList/>}/>
          
            <Route path="/theater/:theater_id/movie/:movie_id" element={<SeatSelection/>}/>
            <Route path="/booking-summary" element={<BookingSummary/>}/>
                  
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/*" element={<h1>Page Not Found</h1>}/>
        </Routes>
      </Router> 
    </MyContextProvider>    
    </>
    
  );
}

export default App;
