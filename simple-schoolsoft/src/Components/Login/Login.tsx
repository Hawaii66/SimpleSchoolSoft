import React, {useRef,useContext} from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Contexts/Usercontext';
import useQuery from '../../Hooks/useQuery';

function Login() {
    const usernameRef = useRef<HTMLInputElement|null>(null);
    const passwordRef = useRef<HTMLInputElement|null>(null);

    const query = useQuery();
    const navigate = useNavigate();

    const {setUsername,setPassword} = useContext(UserContext);

    const login = () => {
        const username = usernameRef?.current?.value || "";
        const password = passwordRef?.current?.value || "";

        setUsername(username);
        setPassword(password);

        const callback = query.get("callback");
        if(callback){navigate(callback);}
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
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Text>Vi ser <b>aldrig</b> ditt lösenord!</Form.Text>
                </Form.Group>
                <Button variant="primary" onClick={()=>login()}>
                    Logga in
                </Button>
            </Form>
        </div>
    )
}

export default Login