import React, { useEffect, useState } from 'react'
import { ProgressBar } from 'react-bootstrap';

interface Props{
    expectedTime:number
}

function Progress({expectedTime}:Props) {
    const [count, setCount] = useState(0);

    useEffect(()=>{
        if(count < 100){
            setTimeout(()=>{
                setCount(Math.min(count + 1, 100));
            },expectedTime / 100 * 1000)
        }
    },[count])

    return (
        <ProgressBar animated now={count} />
    )
}

export default Progress