import "dotenv/config";
import express from 'express';
import connectDB from './config/db';
import { port, appEnv, APP_ORIGIN } from './constants/env';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: APP_ORIGIN,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
)
app.use(cookieParser());

app.get('/', (req, res) => {
    throw new Error('This is a test error');
    res.status(200).json({
        success: false,
        server_response: 'Welcome to MERN API',
    });
});

// Your existing app.listen code
app.listen(port, async () => {
    console.log(`Connecting to port ${port} and in ${appEnv} environment`);
    await connectDB();
});