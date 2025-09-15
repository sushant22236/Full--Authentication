import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.connection.js';

const app = express();

connectDB();

app.use(cors({credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


export default app;