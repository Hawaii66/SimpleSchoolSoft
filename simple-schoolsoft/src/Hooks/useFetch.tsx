import { useEffect, useState } from "react";

export function useFetch<T>(url:string,info:RequestInit) {
    const [data,setData] = useState<T>();
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