import { createContext } from "react";

interface IUserContext {
    setUsername:(i:string)=>void,
    setPassword:(i:string)=>void,
    username:string,
    password:string
}

export const UserContext = createContext<IUserContext>(
    {
        setUsername:()=>{},
        setPassword:()=>{},
        username:"",
        password:""
    }
);