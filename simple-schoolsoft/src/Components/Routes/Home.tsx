import React, { useContext } from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Contexts/Usercontext'
import Food from '../Food/Food'
import Lesson from '../Lesson/Lesson'

function Home() {
	const {username, setPassword, setUsername} = useContext(UserContext);

	const navigate = useNavigate();

	const logout = () => {
		localStorage.removeItem("username");
		localStorage.removeItem("password");

		setPassword("");
		setUsername("");

		navigate("/login?callback=/");
	}

	return (
		<div className="middle down">
			<Lesson/>	
			<Food/>
			<br/>
			<h3>Inloggad som:</h3>
			<p>{username}</p>
			<Button onClick={()=>logout()}>Logga ut</Button>
		</div>
	)
}

export default Home