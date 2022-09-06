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
        <div className={styles['from-self']}>
          {props.messageText}
        </div>
      ) : (
        <div className={styles['from-others']}>
          {props.messageText}
        </div>
      )}
    </div>
  )
};

export default Message;
