import cors from 'cors';
import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import indexRouter from './routes/indexRoutes';
// import { socketEventsDict } from './helpers/socketEvents';
import { consoleLine } from './helpers/misc';

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


io.on(ESocketEventsDict['connection'], (socket) => {
  console.log(`socket.id: `, socket.id);
  // socket.on(socketEventsDict[''], () => {});

});



server.listen(port, () => {
  console.log(`Listening on port ${port}`);

  console.log(consoleLine);
  console.log(consoleLine);

});
