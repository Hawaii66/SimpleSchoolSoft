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
        try{
            var result = await GetLunchMenu(browser,username,password);
            browser.close();
            res.json(result);
        } catch(err){
            browser.close();
            console.log(err);
            res.status(500).send("Error in Puppeteer");
        }
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

        const browser = await puppeteer.launch({headless:false});
        try{
            var result = await GetNextLesson(browser, username, password);
            browser.close();
            res.json(result);
        }catch(err){
            browser.close();
            console.log(err);
            res.status(500).send("Error with Puppeteer");
        }
    });

    app.get("/",(req,res)=>{
        res.status(200).send("Hello World!")
    });
}