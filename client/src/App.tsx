import io, { Socket } from 'socket.io-client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Chat from './pages/Chat/Chat';
import './styles/App.sass';

// interface ISocket extends Socket {
// }

const port = 'http://localhost:8000';
const socket: Socket = io(port);

const App = () => {

  return (
    <>
      <BrowserRouter>
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
