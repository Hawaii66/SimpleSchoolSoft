import React, { useContext } from 'react'
import { Card, Placeholder, ProgressBar } from 'react-bootstrap';
import { StaticContext } from '../../Contexts/StaticContext';
import { UserContext } from '../../Contexts/Usercontext';
import { useFetch } from '../../Hooks/useFetch';
import { ILunch } from '../../Interfaces/Schoolsoft';
import Progress from '../Progress';

function Food() {
    const {username,password} = useContext(UserContext);
    const {apiEndPoint} = useContext(StaticContext);

    const url = `${apiEndPoint}/lunch?username=${username}&password=${password}`;
    const {data,loading} = useFetch<ILunch[]>(url,{method:"GET"});

    if(loading || data === null || data === undefined){
        return (
            <Card className="w30 border-card">
                <Card.Img variant="top" />
                <Card.Body>
                    <Card.Title className="text-center"><Placeholder xs={4}/></Card.Title>
                    <Card.Text>
                    <Placeholder xs={2}/> <Placeholder xs={5}/> <Placeholder xs={4}/>
                    <br/>
                    <Placeholder xs={5}/> <Placeholder xs={3}/> <Placeholder xs={3}/>
                    </Card.Text>
                    <Progress expectedTime={20}/>
                </Card.Body>
            </Card>
        )
    }

    return (
        <Card className="w30 border-card">
            <Card.Img variant="top" src={data[0].img} />
            <Card.Body>
                <Card.Title className="text-center">Mat:</Card.Title>
                <Card.Text>
                {data[0].normal}
                <br/>
                <b>Veg:</b> {data[0].veg}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Food