import { FC, useEffect, useState } from 'react'

export interface IMessageProps {
  id: number;
  fromSelf: boolean;
  username: string;
  messageText: string;
}

const Message: FC<IMessageProps> = (props) => {

  return (
    <div>
      {props.fromSelf ? (
        <div className='from-self text-blue-600'>
          {props.messageText}
        </div>
      ) : (
        <div className='from-others text-green-600'>
          {props.messageText}
        </div>
      )}
    </div>
  )
};

export default Message;