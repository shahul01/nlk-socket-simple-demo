import { FC, useEffect, useState } from 'react'
import styles from './Message.module.scss';

export interface IMessageProps {
  id: number;
  fromSelf: boolean;
  username: string;
  messageText: string;
}

const Message: FC<IMessageProps> = (props) => {

  return (
    <div className={styles['message-container']}>
      {props.fromSelf ? (
        <div className='from-self text-blue-600'>
          {props.messageText}
        </div>
      ) : (
        <div className='from-others text-pink-600'>
          {props.messageText}
        </div>
      )}
    </div>
  )
};

export default Message;
