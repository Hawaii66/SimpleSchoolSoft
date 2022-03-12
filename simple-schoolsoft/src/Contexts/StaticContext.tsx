import { createContext } from "react";

interface StaticContextInterface {
    apiEndPoint:string,
    website:string,
    debug:boolean
}

export const StaticContext = createContext<StaticContextInterface>(
    {
        apiEndPoint:/*"http://localhost:5000",//*/"https://simpleschoolsoft.herokuapp.com",
        website:/*"http://localhost:3000",//*/"https://www.simple.hawaiidev.net",
        debug:false//*/false
    }
);