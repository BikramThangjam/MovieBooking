// import {useEffect, useState} from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import MovieDetail from './components/MovieDetail/MovieDetail';

function App() {

  return (
    <>      
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="movie/:id" element={<MovieDetail/>}></Route>
          <Route path="/*" element={<h1>Page Not Found</h1>}></Route>
        </Routes>
      </Router>    
    </>
    
  );
}

export default App;
