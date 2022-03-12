import puppeteer from "puppeteer";
import { ILesson, ILunch } from "../Interfaces/Schoolsoft";
require('dotenv').config()

const GetCurrentPage = async (browser:puppeteer.Browser) => 
{
    return (await browser.pages())[1];
}

const Auth = async (browser:puppeteer.Browser, user:string,pass:string, sch:string) => 
{
    if(sch === null){return null;}

    const loginURL = `https://sms12.schoolsoft.se/${sch}/jsp/Login.jsp`
    var page = await GetCurrentPage(browser);

    if(page.url() !== loginURL)
    {
        await page.goto(loginURL);
        page = await GetCurrentPage(browser);
    }

    await page.waitForNetworkIdle();

    //Select Elev user
    await page.select("select[id=usertype]", "1");
    //await sleep(1000);
    await page.waitForNetworkIdle();
    page = await GetCurrentPage(browser);

    const username = await page.$("[id=ssusername]");
    const password = await page.$("[id=sspassword]");
    const loginButton = await page.$("[type=submit]");
    if(!username || !password || !loginButton){return null;}

    await username.type(user);
    await password.type(pass);
    await loginButton.click();

    //await sleep(3000);
    await page.waitForNetworkIdle();

    return await GetCurrentPage(browser);
}

export const GetLunchMenu = async (browser:puppeteer.Browser,username:string,password:string,sch:string) => {
    await browser.newPage();

    var page = await Auth(browser,username,password,sch);
    if(page === null){return;}

    console.log("Lunch - Authed");

    const menu = await page.$("a[name=lunchmenu]");
    menu?.click();

    //await sleep(3000);
    await page.waitForNetworkIdle();

    const lunches =  await page.$$("#lunchmenu_con_content > table");

    console.log("Lunch - Fetching lunches");

    var lunch:ILunch[] = [];
    for(var i = 0; i < lunches.length; i ++)
    {
        const td = (await lunches[i].$$("td[valign=top]"))[1];
        if(!td){return;}
        var food:string|undefined = (await (await td.getProperty("innerHTML")).jsonValue())
        if(!food){return;}
        lunch.push({
            normal:food.split("<br>")[0],
            veg:(food.split("<br>")[1]).replace("Veg:","").trim(),
            time:new Date().getTime(),
            img:""
        });
    }

    console.log("Lunch - Done fetching lunches");

    var promises:Promise<string>[] = [];
    for(var i = 0; i < lunch.length; i ++)
    {
        const image = (browser:puppeteer.Browser, query:string) => {
            return new Promise<string>(async(resolve,reject)=>{
                const page = await browser.newPage();
                await page.goto(`https://www.google.com/search?q=${query}&source=lnms&tbm=isch`)

                const parent = await page.$("div.islrc");
                const firstImg = await parent?.$("div > a > div > img");

                if(!firstImg){return reject("")}

                console.log("Lunch - Image found on google");

                resolve(await(await firstImg.getProperty("src")).jsonValue())
            });
        }

        promises.push(image(browser, lunch[i].normal));
    }

    console.log("Lunch - All google fetches started");

    return await Promise.all<string>(promises).then(res=>{
        for(var i = 0; i < res.length; i ++)
        {
            lunch[i].img = res[i] || "";
        }
        
        console.log("Lunch - Returning lunches");

        return lunch
    });
}

export const GetNextLesson = async (browser:puppeteer.Browser,user:string,pass:string,sch:string) => {
    await browser.newPage();

    var page = await Auth(browser,user,pass,sch);
    if(page === null){return;}

    console.log("Lesson - Authed");

    const scheduleButton = await page.$("[id=menu_schedule]");
    await scheduleButton?.click();

    //await sleep(1000);
    await page.waitForNetworkIdle();

    page = (await browser.pages())[1];

    const schedules = await page.$$('a.schedule')

    console.log("Lesson - Viewing schedule");

    const currentDate = new Date();
    const currentDay = currentDate.getDay()
    var currentMin = currentDate.getMinutes() + currentDate.getHours() * 60;
    currentMin = 580;
    var minDiff = 100000;
    var lesson:ILesson = {
        hour:0,
        minute:0,
        name:"",
        sal:"",
        color:"",
        endHour:0,
        endMinute:0,
        teacher:""
    }

    console.log("Lesson - Starting to loop over lessons");

    for(var i = 0; i < schedules.length; i ++){
        const eng = await schedules[i].$("span");
        if(!eng){return;}
        await eng.click();
        await sleep(250)
        const lectionInfo = await page.$("[id=lessonInfo_content");
        const details:string|undefined = (await(await lectionInfo?.getProperty("innerHTML"))?.jsonValue());
        if(!details){return;}
        const date = details.includes("mån") ? 6 : 
            details.includes("tis") ? 2 :
            details.includes("ons") ? 3 :
            details.includes("tor") ? 4 :
            details.includes("fre") ? 5 :
            details.includes("lör") ? 6 : 0

        if(currentDay === date)
        {
            var timeDetail = details.split(" ")[0];
            const time:{hour:number,min:number} = {
                hour:parseInt(timeDetail.split(":")[0]),
                min:parseInt(timeDetail.split(":")[1])
            }

            const minutes = time.hour * 60 + time.min

            var diff = minutes - currentMin;
            if(diff > 0 && diff < minDiff)
            {
                minDiff = diff;
                
                const color = await schedules[i].$eval("span", el =>
                    getComputedStyle(el).backgroundColor
                );

                const endTime:{hour:number,min:number} = {
                    hour:parseInt(timeDetail.split("-")[1].split(":")[0]),
                    min:parseInt(timeDetail.split("-")[1].split(":")[1])
                }

                const teacherDetails = await page.$("#teachers_content");
                if(!teacherDetails){return null;}
                const teacherNameTD = await teacherDetails.$("td");
                const teacherContent:string|undefined = (await(await teacherNameTD?.getProperty("innerHTML"))?.jsonValue());

                lesson = {
                    hour:time.hour,
                    minute:time.min,
                    endHour:endTime.hour,
                    endMinute:endTime.min,
                    name:details.split("<br>")[1],
                    sal:details.split("<br>")[2],
                    teacher:teacherContent?.split("<br>")[0] || "",
                    color:color
                }

                console.log("Lesson - Setting lesson: ", lesson);
            }
        }

        const closeButton = await page.$("button[title=close]");
        await closeButton?.click();

        console.log("Lesson - Closing button", details);
    }

    console.log("Lesson - Found closest lesson");

    return lesson;
};



function sleep(ms:number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

