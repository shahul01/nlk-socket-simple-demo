import { Link } from 'react-router-dom';
import React from 'react';

const Home = () => {
  return (
    <div>
      <h1 className='text-3xl font-bold'>
        Home 🙋‍♂️
      </h1>
      <br /><hr /><br />
      <Link to="/chat" className="underline text-violet-700">
        Go to Chat
      </Link>

    </div>
  )
};

export default Home;
