import http from 'http';
import express from 'express';
import indexRouter from './routes/indexRoutes';
import { consoleLine } from './helpers/misc';

const app = express();
const server = http.createServer(app);
const port = process.env?.PORT || 8000;


app.use(indexRouter);

server.listen(port, () => {
  console.log(`Listening on port ${port}`);

  console.log(consoleLine);
  console.log(consoleLine);

});
