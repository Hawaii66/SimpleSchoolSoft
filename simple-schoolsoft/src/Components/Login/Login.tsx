import React, {useRef,useContext, useEffect} from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { StaticContext } from '../../Contexts/StaticContext';
import { UserContext } from '../../Contexts/Usercontext';
import useQuery from '../../Hooks/useQuery';

function Login() {
    const usernameRef = useRef<HTMLInputElement|null>(null);
    const passwordRef = useRef<HTMLInputElement|null>(null);
    const schoolRef = useRef<HTMLSelectElement|null>(null);

    const query = useQuery();
    const navigate = useNavigate();

    const {setUsername,setPassword,setSchool} = useContext(UserContext);
    const {website} = useContext(StaticContext);

    const login = () => {
        const username = usernameRef?.current?.value || "";
        const password = passwordRef?.current?.value || "";
        const school = schoolRef?.current?.value || "";

        setUsername(username);
        setPassword(password);
        setSchool(school)

        var callback = query.get("callback");
        if(callback === "/login"){callback="/"}

        if(callback){navigate(callback);}
        else{navigate("/")}
    }

    return (
        <div className="middle full-vh w60">
            <Form className="w50">
                <Form.Label>SchoolSoft</Form.Label>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control ref={usernameRef} type="name" placeholder="Användarnamn ex: eran19" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control ref={passwordRef} type="password" placeholder="Lösenord" />
                </Form.Group>
                <Form.Select ref={schoolRef} aria-label="Välj skola">
                    <option value="nykopingsenskilda">Nyköpings enskilda Gymnasium</option>
                    <option value="nykopingsenskilda">Nyköpings enskilda Grundskola</option>
                </Form.Select>
                <Form.Group className="mb-3 mt-3" controlId="formBasicCheckbox">
                    <Form.Text>Vi ser <b>aldrig</b> ditt Lösenord eller Användarnamn!</Form.Text>
                </Form.Group>
                <Button variant="primary" onClick={()=>login()}>
                    Logga in
                </Button>
            </Form>
        </div>
    )
}

export default Login