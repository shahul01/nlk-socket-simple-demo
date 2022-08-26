/*
 *  Socket.IO Server
 *
 *  Basic:
 *    Client message → Server → Server message → All clients
*/


// COMMT: Imports
import cors from 'cors';
import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import indexRouter from './routes/indexRoutes';
// import { socketEventsDict } from './helpers/socketEvents';
import { consoleLine } from './helpers/misc';
import { ESocketEventsDict, IServerMessageData } from './assets/types/global';

// COMMT: Setup
const app = express();
const server = http.createServer(app);
const io  = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    // origin: "*",
    methods: ["GET", "POST"]
  }
});
const port = process.env?.PORT || 8000;

app.use(cors());
app.use(indexRouter);

// COMMT: Socket IO - Main code
io.on(ESocketEventsDict['connection'], (socket) => {
  console.log(`Connected: `, socket.id);

  // COMMT: to test
  socket.emit('serverMessage', {
    id: 892,
    fromSelf: false,
    username: 'server',
    messageText: 'Hello from socket'
  });


  // COMMT: Emit back serverMessage
  socket.on(
    ESocketEventsDict['clientMessage'],
    ( data: IServerMessageData, callback: () => void ) => {

      const serverMessageData = {
        id: data?.id,
        messageText: data?.messageText
      };

      socket.emit(
        ESocketEventsDict['serverMessage'],
        serverMessageData
      );

      callback();

  });

});


// COMMT: Server listens to port
server.listen(port, () => {
  console.log(`Listening on port ${port}`);

  console.log(consoleLine);
  console.log(consoleLine);

});
