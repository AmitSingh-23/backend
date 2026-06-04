import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app=express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
    
}));
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit :"16kb"}));
app.use(express.static('public'));
app.use(cookieParser());

//route
import userRoute from './route/user.routes.js';
/* importing router just name chnage into userrouter
{when importing default we can chnage name at import }
{whn exporting using {funcname } use the exact fucntion name }
*/

//route declare
app.use('/api/v1/user',userRoute);





export default app;