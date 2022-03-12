import { createContext } from "react";

interface IUserContext {
    setUsername:(i:string)=>void,
    setPassword:(i:string)=>void,
    setSchool:(i:string)=>void,
    username:string,
    password:string,
    school:string
}

export const UserContext = createContext<IUserContext>(
    {
        setUsername:()=>{},
        setPassword:()=>{},
        setSchool:()=>{},
        username:"",
        password:"",
        school:""
    }
);