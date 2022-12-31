import { io, Socket } from 'socket.io-client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav/Nav';
import Home from './pages/Home/Home';
import Chat from './pages/Chat/Chat';
import './styles/App.scss';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8000';
const port = SERVER_URL;
console.log(`SERVER_URL: `, SERVER_URL);
const socket: Socket = io(port);

const App = () => {

  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route
            path="/"
            element={ <Home /> }
          />
          <Route
            path="/chat"
            element={ <Chat socket={socket} /> }
          />

        </Routes>
      </BrowserRouter>
    </>
  )

};

export default App;
