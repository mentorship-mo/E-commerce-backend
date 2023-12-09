import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import {combinedRoutes} from './routes/index'

const app = express()
app.use(express.json())

app.use('/v1' , combinedRoutes)



const Port = process.env.Port || 4000
app.listen(Port , ()=>{
    console.log(
    `🚀  Server is running 
📭  In Port ${Port}`
    );
})