import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home/Home';
import Chat from './pages/Chat/Chat';
import './styles/App.sass';

const App = () => {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/chat" element={ <Chat /> } />

        </Routes>
      </BrowserRouter>
    </>
  )

};

export default App;
