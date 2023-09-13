import React, { useEffect } from 'react';
import LoginFormModel from '../components/LoginFormModel/LoginFormModel';
import { useContext } from 'react';
import MyContext from '../MyContext';
import Login from '../pages/Login/Login';

const ProtectedRoute = (props) => {
    const {isLoggedIn, setIsLoggedIn} = useContext(MyContext)
    const { Component } = props;

    useEffect(()=>{

        let token = localStorage.getItem('access');
        if(token){
            setIsLoggedIn(true)
        }else{
            setIsLoggedIn(false)
        }      
    }, [isLoggedIn])

    if(!isLoggedIn){
        return <Login/>
    }
        
    return <Component />
    

}
export default ProtectedRoute;