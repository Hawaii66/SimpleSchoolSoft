import {Express} from "express"
import puppeteer from "puppeteer";
import { GetLunchMenu, GetNextLesson } from "../Utils/SchoolSoft";

export const Routes = (app:Express) => {
    app.get("/lunch", async(req,res)=>{
        const {username, password} = req.query;

        if(typeof username !== "string" || typeof password !== "string")
        {
            return res.status(400).send("Not valid username or password");
        }

        const browser = await puppeteer.launch({headless:true});
        var result = await GetLunchMenu(browser,username,password);

        res.json(result);
    });

    app.get("/nextlesson", async(req,res)=>{
        const {username, password} = req.query;

        if(typeof username !== "string" || typeof password !== "string")
        {
            return res.status(400).send("Not valid username or password");
        }

        if(username === "" || password === "")
        {
            return res.status(400).send("Not valid username or password formating");
        }

        console.log(username,password);
        console.log(Date.now())
        const browser = await puppeteer.launch({headless:false});
        var result = await GetNextLesson(browser, username, password);
        browser.close();
        console.log(Date.now(),result)
        res.json(result);
    });

    app.get("/",(req,res)=>{
        res.status(200).send("Hello World!")
    });
}