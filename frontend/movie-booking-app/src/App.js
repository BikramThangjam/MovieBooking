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
import ProtectedRoute from './ProtectedRoutes/ProtectedRoutes';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import UpdateProfile from './pages/Settings/UpdateProfile/UpdateProfile';
import ChangePassword from './pages/Settings/ChangePassword/ChangePassword';

function App() {

  return (
    <>
    <MyContextProvider>    
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="movie/:movie_id" element={<MovieDetail/>}/>
          <Route path="theater/:movie_id" element={<ProtectedRoute Component={TheaterList}/>}/>        
          <Route path="/theater/:theater_id/movie/:movie_id" element={<ProtectedRoute Component={SeatSelection}/>}/>
          <Route path="/booking-summary" element={<ProtectedRoute Component={BookingSummary}/>}/>
          <Route path="/profile" element={<ProtectedRoute Component={Profile}/>}/>  
          <Route path="/settings" element={<ProtectedRoute Component={Settings}/>}/>   
          <Route path="/settings/update-profile" element={<ProtectedRoute Component={UpdateProfile}/>}/>  
          <Route path="/settings/change-password" element={<ProtectedRoute Component={ChangePassword}/>}/>   
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/*" element={<h2 className=' text-white text-center pt-5'> 104 <p className='text-white'>Page Not Found :(</p></h2>}/>
        </Routes>
      </Router> 
    </MyContextProvider>    
    </>
    
  );
}

export default App;
