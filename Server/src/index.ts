//const browser = await puppeteer.launch({headless:false});
import cors from "cors";
import express from "express";
import { Routes } from "./Routes/Routes";
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

Routes(app);

app.listen(PORT, () => {
    console.log(`Alive on: http://localhost:${PORT}`);
});