// import {useEffect, useState} from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import MainContent from './components/MainContent/MainContent';
import Navbar from './components/Navbar/Navbar';

function App() {

  return (
    <>      
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<MainContent/>}></Route>
          <Route path="movie/:id" element={<h1>Movie Detail Page</h1>}></Route>
          <Route path="/*" element={<h1>Page Not Found</h1>}></Route>
        </Routes>
      </Router>    
    </>
    
  );
}

export default App;
