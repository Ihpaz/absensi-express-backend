import express, {NextFunction, Request , Response} from "express";
import dotenv from "dotenv";
import router from "./routes/Routes";
import bodyParser from "body-parser";
import { UnauthorizedError } from "express-jwt";
import { expressjwt } from "express-jwt";
import connection from "./config/dbConnect";
import cors from "cors";
const secret= process.env.JWT_SECRET as string;
dotenv.config();
const app= express();

app.get("/",(req:Request, res:Response)=>{
    return res.status(200).send({
        response: "Aplikasi Absensi"
    })
})

app.use(cors())
app.use(express.static('uploads'))
app.use(
  expressjwt({ secret: secret, algorithms: ['HS256'], }).unless({
    path: ['/', '/auth/login','/auth/loginadmin'], 
  })
);
app.use((err: UnauthorizedError, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ code:401,status:'error',message: 'Unauthorized' });
  } else {
    next(err);
  }
});
app.use(bodyParser.json())
app.use(router)


//hanya buat test agar gampang
connection.sync();

app.listen(process.env.APP_PORT, () =>{
    console.log(`${process.env.APP_NAME} running on port ${process.env.APP_PORT}`)
})