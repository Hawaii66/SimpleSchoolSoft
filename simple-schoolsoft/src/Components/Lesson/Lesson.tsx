import React, { useContext, useEffect, useState } from 'react'
import { Card, Placeholder } from 'react-bootstrap';
import { StaticContext } from '../../Contexts/StaticContext';
import { UserContext } from '../../Contexts/Usercontext';
import { useFetch } from '../../Hooks/useFetch';
import { ILesson } from '../../Interfaces/Schoolsoft';
import Progress from '../Progress';

const parseMinute = (min:number) => {
    var time = min.toString();
    
    if(time.length === 1){
        time += "0";
    }

    return time;
}

function Lesson() {
    const {username,password} = useContext(UserContext);
    const {apiEndPoint} = useContext(StaticContext);

    const url = `${apiEndPoint}/nextlesson?username=${username}&password=${password}`;
    const {data,loading} = useFetch<ILesson>(url,{method:"GET"});

    const date = new Date();
    var timeDiff = data === undefined ? 0 : (data.hour * 60 + data.minute) - (date.getHours() * 60 + date.getMinutes())
    var timeDiff = data === undefined ? 0 : (data.hour * 60 + data.minute) - 580;

    if(data && !loading && data.name === ""){
        return(
            <Card className="w30 border-card m2">
                <Card.Body>
                    <Card.Title>Något gick fel</Card.Title>
                    <Card.Text>
                        Vi kan inte ladda ner din nästa lektion. Försök att ladda om hemsidan och testa igen.
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }

    if(loading || data === null || data === undefined)
    {
        return (
            <Card className="w30 border-card m2">
                <Card.Body>
                    <Card.Title><Placeholder xs={5}/></Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        <Placeholder xs={3}/> <Placeholder xs={4}/>
                    </Card.Subtitle>
                    <Card.Text>
                        <Placeholder xs={4}/> <Placeholder xs={2}/> <Placeholder xs={5}/>
                        <Placeholder xs={3}/> <Placeholder xs={6}/> <Placeholder xs={2}/>
                    </Card.Text>
                    <Progress expectedTime={30}/>
                </Card.Body>
            </Card>
        )
    }

    return (
        <Card className="w30 border-card m2">
            <Card.Body>
                <Card.Title>{data.name}: {data.sal}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{data.hour}:{parseMinute(data.minute)} - {data.endHour}:{parseMinute(data.endMinute)}</Card.Subtitle>
                <Card.Text>
                    Lektionen börjar om: <b>{timeDiff} minuter</b>
                    <br/>
                    Lärare: {data.teacher}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Lesson