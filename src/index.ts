import "dotenv/config";
import express from 'express';
import connectDB from './config/db';
import { port, appEnv, APP_ORIGIN } from './constants/env';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import catchErrors from "./utils/catchErrors";
import { HTTP_STATUS } from "./constants/http";
import authRoutes from "./routes/auth.routes";
import errorHandler from "./middleware/errorHandler";
import authenticate from "./middleware/authenticate";
import sessionRoutes from "./routes/session.routes";
import userRoutes from "./routes/user.routes";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: APP_ORIGIN,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    })
)
app.use(cookieParser());

app.get('/', 
    catchErrors(async (req, res, next) => {
    res.status(HTTP_STATUS.OK).json({
        success: true,
        server_response: 'Welcome to MERN API',
    });
}));

app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);
// protected routes
app.use("/api/v1/user", authenticate, userRoutes);
app.use("/api/v1/sessions", authenticate, sessionRoutes);


// Your existing app.listen code
app.listen(port, async () => {
    console.log(`Connecting to port ${port} and in ${appEnv} environment`);
    await connectDB();
});