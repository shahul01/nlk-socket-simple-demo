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
io.on(ESocketEventsDict['connect'], (socket) => {
  console.log(`Connected: `, socket.id);

  // COMMT: Emit this whenever a user joins
  socket.on(
    ESocketEventsDict['joinRoom'],
    ({ name, room }: IUser, callback: (argo:string, arg1:string)=>void) => {

      try {
        const { error, user } = addUser({ id: socket?.id, name, room });

        if (error) return callback('error', error);

        // COMMT: Important code
        socket.join(user?.room);

        socket
          .emit(ESocketEventsDict['serverMessage'], {
            id: uuid(6), // TODO: uuid num+string
            from: 'admin',
            username: 'admin',
            messageText: `Welcome to ${user?.room} room, ${user?.name}.`
          });

        socket
          .to(user?.room)
          .emit(ESocketEventsDict['serverMessage'], {
            id: uuid(6),
            from: 'admin',
            username: 'admin',
            messageText: `A new user '${name}' has joined.`
          });

        callback('name', name);

      } catch (err) {
        console.error(`Error: `, err);
        callback('error', JSON?.stringify(err));

      }
    }
  );

  // COMMT: When user types
  socket.on(
    ESocketEventsDict['clientTyping'],
    ({ name, room }: IUser) => {

      socket
        .to(room)
        .emit(
          ESocketEventsDict['serverTyping'],
          name
        )

    }
  );

  // COMMT: Emit back clientMessage to other clients
  socket.on(
    ESocketEventsDict['clientMessage'],
    ( data: IServerMessageData, callback: (arg:string|null)=>void ) => {

      try {
        const serverMessageData = {
          id: data?.id,
          from: 'others',
          username: data?.username,
          room: data?.room,
          messageText: data?.messageText
        };

        socket
        .to(data.room)
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
