import { FC, useEffect, useState } from 'react';
import Message, { IMessageProps } from '../Message/Message';

interface IMessagesProps {
  messageList: IMessageProps[]
}

const Messages: FC<IMessagesProps> = (props) => {

  return (
    <div>
      {props.messageList?.map(currList => (
        <div key={currList.id}>
          <Message
            id={currList.id}
            fromSelf={currList.fromSelf}
            username={currList.username}
            messageText={currList.messageText}
          />
        </div>
      ))}
    </div>
  )
};

export default Messages;