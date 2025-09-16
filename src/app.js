import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.connection.js';
import apiroute from './route/route.js';
import cookieParser from "cookie-parser";


const app = express();

connectDB();

app.use(cookieParser());
app.use(cors({credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiroute);

export default app;