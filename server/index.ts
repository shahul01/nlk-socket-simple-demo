/*
 *  Socket.IO Server
 *
 *  Basic:
 *    Client connected to Server → Client message → Server → Server message → All other clients in that room
 *
 *  Events added: joinRoom, clientMessage, serverMessage, isTyping, disconnect
 *
*/


// COMMT: Imports
import cors from 'cors';
import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import indexRouter from './routes/indexRoutes';
import { addUser, removeUser, getUser, getUsersInRoom } from './helpers/users';
// import { socketEventsDict } from './helpers/socketEvents';
import { consoleLine, uuid } from './helpers/misc';
import { ESocketEventsDict, IUser, IServerMessageData, IIsTyping } from './assets/types/global';

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
        // console.log(`User data: `, getUser(socket.id));

        if (error) return callback('error', error);
        if (!user?.room) return;

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

  // COMMT: Whether a user is typing or not
  socket.on(
    ESocketEventsDict['isTyping'],
    ({name,room,isTyping}: IIsTyping) => {

      socket
        .to(room)
        .emit(
          ESocketEventsDict['isTyping'],
          name,
          isTyping
        );

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
          messageText: data?.messageText
        };

        const user:IUser = getUser(socket.id)

        socket
        .to(user.room)
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
      (reason:string) => {
        const user = getUser(socket.id);
        socket
          .to(user?.room)
          .emit(ESocketEventsDict['serverMessage'],{
            id: uuid(6),
            from: 'admin',
            username: 'admin',
            messageText: `User ${user?.name} has left the chat.`,
          });
        removeUser(socket.id);
        // console.log(`User ${user?.name} in ${user?.room} has left the chat.`);
      },
  );

});


// COMMT: Server listens to port
server.listen(port, () => {
  console.log(`Listening on port ${port}`);

  console.log(consoleLine);
  console.log(consoleLine);

});
