import { useContext, useEffect } from "react";
import { UserContext } from "../Contexts/Usercontext";

function useAuthed() {
    const {username,password,school} = useContext(UserContext);
    
    const auth = () => {
        console.log(username,password,school);

        return username !== "" && password !== "" && school !== "";
    }

    useEffect(()=>{
        auth();
    },[username,password,school]);
    
    return auth;
}

export default useAuthed;