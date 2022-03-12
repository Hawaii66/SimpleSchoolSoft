import { useEffect, useState } from "react";

export const useFetch = (url:string, info:RequestInit) => {
    const [data,setData] = useState();
    const [error,setError] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        setLoading(true);
        fetch(url,info)
            .then(res=>res.json())
            .then(setData)
            .catch(setError)
            .finally(()=>setLoading(false))
    },[url]);

    console.log(data,loading);

    return {data,error,loading};
}
