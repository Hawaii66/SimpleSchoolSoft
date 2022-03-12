import { useContext } from "react";
import { UserContext } from "../Contexts/Usercontext";

function useAuthed() {
    const {username,password} = useContext(UserContext);

    return username !== "" && password !== "";
}

export default useAuthed;