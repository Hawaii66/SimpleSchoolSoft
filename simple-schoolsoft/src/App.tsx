import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RouterApp from './Components/Routes/RouterApp';
import { UserContext } from './Contexts/Usercontext';

import "./app.css";

function App() {
	const [username, setUser] = useState("");
	const [password, setPass] = useState("");
	const [school, setSch] = useState("");

	const setUsername = (i:string) => {
		localStorage.setItem("username",i);
		setUser(i);
	}

	const setPassword = (i:string) => {
		localStorage.setItem("password",i);
		setPass(i);
	}

	const setSchool = (i:string) => {
		localStorage.setItem("school", i);
		setSch(i);
	}

	useEffect(()=>{
		const localUsername = localStorage.getItem("username");
		const localPassword = localStorage.getItem("password");
		const localSchool = localStorage.getItem("school");

		if(localUsername){setUser(localUsername);}
		if(localPassword){setPass(localPassword);}
		if(localSchool){setSch(localSchool);}
	},[]);

	return(
		<UserContext.Provider value={{setPassword,setUsername,setSchool,username,password,school}}>
			<Router>
				<RouterApp/>
			</Router>
		</UserContext.Provider>
	)
}

export default App;
