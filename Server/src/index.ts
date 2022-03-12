import puppeteer from "puppeteer";
require('dotenv').config()

const GetCurrentPage = async (browser:puppeteer.Browser) => 
{
    return (await browser.pages())[1];
}

const Auth = async (browser:puppeteer.Browser) => 
{
    const loginURL = "https://sms12.schoolsoft.se/nykopingsenskilda/jsp/Login.jsp"
    var page = await GetCurrentPage(browser);

    if(page.url() !== loginURL)
    {
        await page.goto(loginURL);
        page = await GetCurrentPage(browser);
    }

    //Select Elev user
    await page.select("select[id=usertype]", "1");
    await sleep(1000);
    page = await GetCurrentPage(browser);

    const username = await page.$("[id=ssusername]");
    const password = await page.$("[id=sspassword]");
    const loginButton = await page.$("[type=submit]");
    if(!username || !password || !loginButton){return null;}

    await username.type(process.env.username || "");
    await password.type(process.env.password || "");
    await loginButton.click();

    await sleep(3000);
    return await GetCurrentPage(browser);
}

const GetLunchMenu = async () => {
    const browser = await puppeteer.launch({headless:false});
    await browser.newPage();
    var page = await Auth(browser);
    if(page === null){return;}

    const menu = await page.$("a[name=lunchmenu]");
    menu?.click();

    await sleep(3000);

    const lunches =  await page.$$("#lunchmenu_con_content > table");

    var lunch:Lunch[] = [];
    for(var i = 0; i < lunches.length; i ++)
    {
        const td = (await lunches[i].$$("td[valign=top]"))[1];
        if(!td){return;}
        var food:string|undefined = (await (await td.getProperty("innerHTML")).jsonValue())
        if(!food){return;}
        lunch.push({
            normal:food.split("<br>")[0],
            veg:(food.split("<br>")[1]).replace("Veg:","").trim(),
            time:new Date().getTime()
        });
    }

    var promises:Promise<unknown>[] = [];
    for(var i = 0; i < lunch.length; i ++)
    {
        const image = (browser:puppeteer.Browser, query:string) => {
            return new Promise(async(resolve,reject)=>{
                const page = await browser.newPage();
                await page.goto(`https://www.google.com/search?q=${query}&source=lnms&tbm=isch`)

                const parent = await page.$("div.islrc");
                const firstImg = await parent?.$("div > a > div > img");

                if(!firstImg){return reject("")}

                resolve(await(await firstImg.getProperty("src")).jsonValue())
            });
        }

        promises.push(image(browser, lunch[i].normal));
    }

    Promise.all(promises).then(res=>{
        console.log(res[0]);
    })

    console.log(lunch);
}

GetLunchMenu();

const GetNextLesson = async () => {
    const browser = await puppeteer.launch({headless:false});
    var page = await browser.newPage();
    await page.goto("https://sms12.schoolsoft.se/nykopingsenskilda/jsp/Login.jsp");

    await page.select("select[id=usertype]", "1");
    await sleep(1000);
    page = (await browser.pages())[1];

    const username = await page.$("[id=ssusername]")
    const password = await page.$("[id=sspassword]")
    const loginButton = await page.$("[type=submit]")
    if(username === null || password === null){return;}
    await username.type(process.env.username || "")
    await password.type(process.env.password || "")
    await loginButton?.click();

    await sleep(3000);
    page = (await browser.pages())[1];

    const scheduleButton = await page.$("[id=menu_schedule]");
    await scheduleButton?.click();

    await sleep(1000);
    page = (await browser.pages())[1];

    const schedules = await page.$$('a.schedule')

    const currentDate = new Date();
    const currentDay = currentDate.getDay()
    var currentMin = currentDate.getMinutes() + currentDate.getHours() * 60;
    currentMin = 580;
    var minDiff = 100000;
    var lesson:Lesson = {
        hour:0,
        minute:0,
        name:"",
        sal:"",
        color:""
    }
    for(var i = 0; i < schedules.length; i ++){
        const eng = await schedules[i].$("span");
        if(!eng){return;}
        await eng.click();
        await sleep(500)
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

                lesson = {
                    hour:time.hour,
                    minute:time.min,
                    name:details.split("<br>")[1],
                    sal:details.split("<br>")[2],
                    color:color
                }
            }
        }

        const closeButton = await page.$("button[title=close]");
        await closeButton?.click();
    }

    console.log(minDiff,lesson);
};



function sleep(ms:number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

interface Lesson {
    name:string,
    hour:number,
    minute:number,
    sal:string,
    color:string
}

interface Lunch {
    normal:string,
    veg:string,
    time:number
}