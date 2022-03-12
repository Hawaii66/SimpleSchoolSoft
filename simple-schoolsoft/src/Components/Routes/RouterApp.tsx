import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import useAuthed from '../../Hooks/useAuthed'
import Login from '../Login/Login'
import Home from './Home'

function RouterApp() {
    const authed = useAuthed();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        setTimeout(()=>{
            setLoading(false);
            if(!authed)
            {
                console.log("TEST");
                navigate(`/login?callback=${location.pathname}`);
            }
        },500);
	},[])

    if(loading){
        return(<h1>Loading</h1>)
    }

    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
        </Routes>
    )
}

export default RouterApp