const express=require('express');
const app=express();
const connectDb=require('./dbconfig');
const cors=require('cors');
const morgan=require('morgan');
const Messages=require('./models/messageModel');

const authRoute=require('./routers/AllRoutes');
const http = require('http');
const server = http.Server(app);

const socketIO = require('socket.io');
const io = socketIO(server);


app.use(cors({
    origin:[ 'http://localhost:4200' , 'http://127.0.0.1:4200'],
    credentials:true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use('/api',authRoute);
connectDb();


io.on('connection',(socket)=>{
    console.log('new connection is made');
    socket.join(socket.handshake.query.username);
    console.log(socket.handshake.query.username,' joined');

    socket.on('message',function(data){
        if(data.type=='group'){
            socket.join(data.receiver);
            console.log(data.receiver,' joined');
        }

        socket.in(data.receiver)
        .emit('new message',{sender: data.sender,receiver: data.receiver, message: data.message});
        console.log('msg send');
        
        const newMsg= new Messages();
        newMsg.sender=data.sender;
        newMsg.receiver=data.receiver;
        newMsg.msg=data.message;
        newMsg.save((err)=>{
            if (err) console.log('message save err',err);
            else{
                console.log('msg saved to db');
            }
        }) 
      })

    socket.on('group-msg',function(data){
        socket.join(data.receiver);
        console.log(data.receiver,' joined');
        socket.in(data.receiver)
        .emit('new group-msg',{sender: data.sender,receiver: data.receiver, message: data.message});
        console.log('group-msg send');    
    })

})



const port=process.env.PORT || 5000;

server.listen(port,'0.0.0.0',()=>
    console.log('listening to port',port));