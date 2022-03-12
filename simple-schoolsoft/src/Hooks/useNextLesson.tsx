import { useContext } from "react";
import { StaticContext } from "../Contexts/StaticContext";
import { UserContext } from "../Contexts/Usercontext";
import { ILesson } from "../Interfaces/Schoolsoft";
import { useFetch } from "./useFetch";

interface INextLesson {
    data:ILesson|null,
    loading:boolean
}

function useNextLesson():INextLesson{
    const {username,password} = useContext(UserContext);
    const {apiEndPoint} = useContext(StaticContext);

    const url = `${apiEndPoint}/nextlesson?username=${username}&password=${password}`;
   
    const {data, error, loading} = useFetch<ILesson>(url,{method:"GET"});

    if(error !== undefined || data === undefined)
    {
        return {data:null,loading:true};
    }

    return {data:data,loading};
}

export default useNextLesson;