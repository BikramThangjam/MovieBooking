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
import BookingList from './components/BookingList/BookingList';
import Dashboard from './pages/Dashboard/Dashboard';
import DashboardHome from './components/AdminDashboard/DashboardHome/DashboardHome';
import MovieAdmin from './components/AdminDashboard/MovieAdmin/MovieAdmin';
import SeatAdmin from './components/AdminDashboard/SeatAdmin/SeatAdmin';
import AddMovie from './components/AdminDashboard/MovieAdmin/AddMovie/AddMovie';
import UpdateMovie from './components/AdminDashboard/MovieAdmin/UpdateMovie/UpdateMovie';
import DeleteMovie from './components/AdminDashboard/MovieAdmin/DeleteMovie/DeleteMovie';
import AddSeat from './components/AdminDashboard/SeatAdmin/AddSeat/AddSeat';
import UpdateSeat from './components/AdminDashboard/SeatAdmin/UpdateSeat/UpdateSeat';
import UserAdmin from './components/AdminDashboard/UserAdmin/UserAdmin';
import CreateUser from './components/AdminDashboard/UserAdmin/CreateUser/CreateUser';
import UpdateUser from './components/AdminDashboard/UserAdmin/UpdateUser/UpdateUser';
import DeleteUser from './components/AdminDashboard/UserAdmin/DeleteUser/DeleteUser';
import TheaterAdmin from './components/AdminDashboard/TheaterAdmin/TheaterAdmin';
import AddTheater from './components/AdminDashboard/TheaterAdmin/AddTheater/AddTheater';
import UpdateTheater from './components/AdminDashboard/TheaterAdmin/UpdateTheater/UpdateTheater';
import DeleteTheater from './components/AdminDashboard/TheaterAdmin/DeleteTheater/DeleteTheater';


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
          <Route path="/booking-list" element={<ProtectedRoute Component={BookingList}/>}/>
          <Route path="/profile" element={<ProtectedRoute Component={Profile}/>}/>  
          <Route path="/settings" element={<ProtectedRoute Component={Settings}/>}/>   
          <Route path="/settings/update-profile" element={<ProtectedRoute Component={UpdateProfile}/>}/>  
          <Route path="/settings/change-password" element={<ProtectedRoute Component={ChangePassword}/>}/>   
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/dashboard/" element={<ProtectedRoute Component={Dashboard}/>}>
            <Route index element={<DashboardHome />} /> {/*default route for a dashboard*/}
            <Route path="user-admin/" element={<UserAdmin/>}>
              <Route index element={<CreateUser/>}/>
              <Route path="create-user" element={<CreateUser/>}/>
              <Route path="update-user" element={<UpdateUser/>}/>
              <Route path="delete-user" element={<DeleteUser/>}/>
            </Route>
            <Route path="movie-admin/" element={<MovieAdmin/>}>
              <Route index element={<AddMovie/>}/>
              <Route path="add-movie" element={<AddMovie/>}/>
              <Route path="update-movie" element={<UpdateMovie/>}/>
              <Route path="delete-movie" element={<DeleteMovie/>}/>
            </Route>
            <Route path="seat-admin" element={<SeatAdmin/>}>
              <Route index element={<AddSeat/>}/>
              <Route path="add-seat" element={<AddSeat/>}/>
              <Route path="update-seat" element={<UpdateSeat/>}/>
            </Route>
            <Route path="theater-admin/" element={<TheaterAdmin/>}>
              <Route index element={<AddTheater/>}/>
              <Route path="add-theater" element={<AddTheater/>}/>
              <Route path="update-theater" element={<UpdateTheater/>}/>
              <Route path="delete-theater" element={<DeleteTheater/>}/>
            </Route> 
          </Route>  
          <Route path="/*" element={<h2 className=' text-white text-center pt-5'> 104 <p className='text-white'>Page Not Found :(</p></h2>}/>
        </Routes>
      </Router> 
    </MyContextProvider>    
    </>
    
  );
}

export default App;
