import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import AuthRoutes from './routes/AuthRoutes.js'
import MessageRoutes from './routes/MessageRoutes.js'
import { Server, Socket } from 'socket.io'
import bodyParser from 'body-parser'
const app = express()

dotenv.config()

app.use(cors())
app.use(express.json())
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use("/uploads/image/",express.static("uploads/image"))
app.use("/uploads/recordings/",express.static("uploads/recordings"))
app.use("/api/auth",AuthRoutes)
app.use("/api/messages",MessageRoutes)


const PORT = process.env.PORT || 8000

const server = app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

app.get('/',(req,res)=>{
    res.send("<h1>Chat Backend Started !!!</h1>")
})

const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000"
    },
})
global.onlineUsers = new Map();
io.on("connection",(socket)=>{
    global.chatSocket = socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id);
    })
socket.on("send-msg",(data)=>{
    const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve",{
                from:data.from,
                message:data.message,
            })
        }
    })
    })
    
