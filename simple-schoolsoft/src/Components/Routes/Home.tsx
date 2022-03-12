import React, { useContext } from 'react'
import { Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
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
		<div className="middle down m2">
			<h1>Enkla SchoolSoft</h1>
			<Lesson/>	
			<Food/>
			<br/>
			<h3>Inloggad som:</h3>
			<p>{username}</p>
			<Button className="mb2" onClick={()=>logout()}>Logga ut</Button>
			<Card>
				<Card.Body>
					<Card.Title>Kontakt Information</Card.Title>
					<Card.Text>
						<b>Skapare:</b> Sebastian Ahlman
						<br/>
						<b>Klass:</b> Na21B
						<br/>
						<b>Email:</b> hawaiilive@outlook.com
						<br/>
						<b>Kod:</b> <a target="_blank" href="https://github.com/Hawaii66/SimpleSchoolSoft">Github</a>
					</Card.Text>
				</Card.Body>
			</Card>
		</div>
	)
}

export default Home