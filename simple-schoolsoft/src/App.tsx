import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RouterApp from './Components/Routes/RouterApp';
import { UserContext } from './Contexts/Usercontext';

import "./app.css";

function App() {
	const [username, setUser] = useState("");
	const [password, setPass] = useState("");

	const setUsername = (i:string) => {
		localStorage.setItem("username",i);
		setUser(i);
	}

	const setPassword = (i:string) => {
		localStorage.setItem("password",i);
		setPass(i);
	}

	useEffect(()=>{
		const localUsername = localStorage.getItem("username");
		const localPassword = localStorage.getItem("password");

		if(localUsername){setUser(localUsername);}
		if(localPassword){setPass(localPassword);}
	},[]);

	return(
		<UserContext.Provider value={{setPassword,setUsername,username,password}}>
			<Router>
				<RouterApp/>
			</Router>
		</UserContext.Provider>
	)
}

export default App;
