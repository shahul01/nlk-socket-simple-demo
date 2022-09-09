/*
 *  Socket.IO Server
 *
 *  Basic:
 *    Client message → Server → Server message → All clients
 *
 *  Events Added: joinRoom, clientMessage
 *
*/


// COMMT: Imports
import cors from 'cors';
import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import indexRouter from './routes/indexRoutes';
import { addUser, removeUser } from './helpers/users';
// import { socketEventsDict } from './helpers/socketEvents';
import { consoleLine, uuid } from './helpers/misc';
import { ESocketEventsDict, IUser, IServerMessageData } from './assets/types/global';

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

  // socket.emit(ESocketEventsDict['serverMessage'], {
  //   id: 123456, // TODO: string type and uuid with num+string
  //   from: 'admin',
  //   username: 'admin',
  //   messageText: 'Welcome!'
  // });

  // COMMT: Emit this whenever a user joins
  socket.on(
    ESocketEventsDict['joinRoom'],
    ({ name, room }: IUser, callback: (arg:string|null)=>void) => {

      try {
        const { error, user } = addUser({ id: socket?.id, name, room });

        if (error) return callback(error);

        // COMMT: Important code
        socket.join(user?.room);

        socket.emit(ESocketEventsDict['serverMessage'], {
          id: uuid(), // TODO: string type and uuid with num+string
          from: 'admin',
          username: 'admin',
          messageText: `Welcome to ${user?.room} room, user ${user?.name}`
        });

        socket.broadcast
          .to(user?.room)
          .emit(ESocketEventsDict['serverMessage'], {
            id: uuid(),
            from: 'admin',
            username: 'admin',
            messageText: `New User ${name} has joined.`
          });

        // COMMT: TODO: send users in room to client

        callback(null);
      } catch (err) {
        console.error(`Error: `, err);
        callback(JSON?.stringify(err));
      }
    }
  );

  // COMMT: Emit back clientMessage to other clients
  socket.on(
    ESocketEventsDict['clientMessage'],
    ( data: IServerMessageData, callback: (arg:string|null)=>void ) => {

      const serverMessageData = {
        id: data?.id,
        from: 'others',
        username: data?.username,
        messageText: data?.messageText
      };

      try {

        // io.to(user.room).emit
        socket.broadcast
        // .to(user.room)
        .emit(
          ESocketEventsDict['serverMessage'],
          serverMessageData
        );

        console.log(`serverMessageData: `, serverMessageData);

        callback(null);
      } catch (err) {
        console.error(`Error: `, err);
        callback(JSON?.stringify(err));
      };


    }
  );

  // COMMT: Disconnect user on leaving / refreshing
  socket.on(
    ESocketEventsDict['disconnect'],
    (user:IUser ) => {
      socket
        .to(user?.room)
        .emit(`User ${user?.name} has left`)
    },
    removeUser(socket.id)
  );

});


// COMMT: Server listens to port
server.listen(port, () => {
  console.log(`Listening on port ${port}`);

  console.log(consoleLine);
  console.log(consoleLine);

});
