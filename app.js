const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = require("socket.io")(server,{
    transports:['polling'],
  cors:{
    cors: {
      origin: "*"
    }
}
});
/**
 *---------- configs  -----------
 */
app.use(cors());
app.use(cookieParser());
app.use(express.json());
///app.use(socketFileU.router);
dotenv.config();
//connect to databse (mongo )
const dbConnect = require('./config/dbConnect');
dbConnect();

//=============  START ROUTE ===========
const userAuthRouter = require('./routes/auth.route');
const messengerRouter = require('./routes/messenger.route');
const {verfiyUserAuth} = require('./middleware/verfiyUserAuth')
app.use('/api/messenger/user/', userAuthRouter);
app.use('/api/messenger/', messengerRouter);

///api/messenger/test
const testRoute = require('./routes/test.route');
app.use('/api/messenger/test/', testRoute);

// check if user authenticated

//============= END ROUTE  ==============

//=============================== START SOCKETIO ==========================
const{socketio} = require('./socketio/socket');
socketio(io);


//=============================== END SOCKETIO ============================

if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname,'client/build')));
  app.get('*',(req,res)=>{
      res.sendFile(path.resolve(__dirname,"client","build","index.html"))
  })
}
const port = process.env.PORT;
server.listen(port, () => console.log(`socket server satrt listening on port ${port}!`));
