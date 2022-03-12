import React, { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import useAuthed from '../../Hooks/useAuthed'
import Login from '../Login/Login'
import Home from './Home'

function RouterApp() {
    const authed = useAuthed();
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(()=>{
		if(!authed)
		{
			navigate(`/login?callback=${location.pathname}`);
		}
	},[])

    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
        </Routes>
    )
}

export default RouterApp