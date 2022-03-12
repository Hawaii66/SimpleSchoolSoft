import React, { useContext } from 'react'
import { Card, Placeholder, ProgressBar } from 'react-bootstrap';
import { StaticContext } from '../../Contexts/StaticContext';
import { UserContext } from '../../Contexts/Usercontext';
import { useFetch } from '../../Hooks/useFetch';
import { ILunch } from '../../Interfaces/Schoolsoft';
import Progress from '../Progress';

function Food() {
    const {username,password,school} = useContext(UserContext);
    const {apiEndPoint} = useContext(StaticContext);

    const url = `${apiEndPoint}/lunch?username=${username}&password=${password}&school=${school}`;
    const {data,loading} = useFetch<ILunch[]>(url,{method:"GET"});

    var dayIndex = (new Date()).getDay() - 1;
    if(dayIndex === -1){dayIndex = 6;} // Sunday is 0 but should be 6

    dayIndex = 3;

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

    if(!loading && dayIndex >= data.length){
        return(
            <Card className="w30 border-card">
                <Card.Body>
                    <Card.Title className="text-center">Något gick fel</Card.Title>
                    <Card.Text> 
                        Det ser ut som att du försöker ladda ner en helgs mat. Det funkar inte. Skolan har bara mat på vardagar.
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }

    return (
        <Card className="w30 border-card">
            <Card.Img variant="top" src={data[dayIndex].img} />
            <Card.Body>
                <Card.Title className="text-center">Mat:</Card.Title>
                <Card.Text>
                {data[dayIndex].normal}
                <br/>
                {data[dayIndex].veg !== "" ? <><b>Veg:</b> {data[dayIndex].veg}</> : ""}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Food