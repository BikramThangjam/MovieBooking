import React, { useEffect } from 'react';
import LoginFormModel from '../components/LoginFormModel/LoginFormModel';
import { useContext } from 'react';
import MyContext from '../MyContext';

const ProtectedRoute = (props) => {
    const {isLoggedIn, setIsLoggedIn} = useContext(MyContext)
    const { Component } = props;

    useEffect(()=>{
        let token = localStorage.getItem('access');
        if(token){
            setIsLoggedIn(true)
        }       
    }, [isLoggedIn])

    if(!isLoggedIn){
        return <LoginFormModel/>
    }
        
    return <Component />
    

}
export default ProtectedRoute;