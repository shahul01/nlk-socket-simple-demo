import { FC, useEffect, useState } from 'react';
import Messages from '../../components/Messages/Messages';

interface IChatProps {
}

const Chat: FC<IChatProps> = (props) => {

  const tempData = [
    {
      id: 1,
      fromSelf: true,
      username: 'Me',
      messageText: 'Hello'
    },
    {
      id: 2,
      fromSelf: false,
      username: 'Others1',
      messageText: 'Hi'
    }
  ];

  return (
    <div>
      <p>Chat</p>
      <br /><hr /><br />
      <Messages messageList={tempData} />
    </div>
  )
};

export default Chat;