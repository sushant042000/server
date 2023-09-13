const http=require("http");
const express =require("express");
const cors = require("cors");
const socketIO = require("socket.io");
const dotenv=require("dotenv");

dotenv.config({path:"./config.env"});

const app=express();
const port= process.env.PORT ;



const users=[{}];

app.use(cors());
app.get("/",(req,res)=>{
    res.send("HELL ITS WORKING");
})

const server=http.createServer(app);

const io=socketIO(server);

io.on("connection",(socket)=>{
   

    socket.on('joined',({user})=>{
          users[socket.id]=user;
        
          socket.broadcast.emit('userJoined',{user:"Admin",message:` ${users[socket.id]} has joined`});
          socket.emit('welcome',{user:"Admin",message:`Welcome to the chat, ${users[socket.id]} `})
    })

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id});
    })

    socket.on('disconnected',()=>{
          socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]}  has left`});
        
       
    })
});


server.listen(port,()=>{
    console.log(`Working on port ${port}`);
})