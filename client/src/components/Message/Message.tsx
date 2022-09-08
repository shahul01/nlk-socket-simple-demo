import { FC, useEffect, useState } from 'react'
import { IClientMessageData } from '../../types/global';
import styles from './Message.module.scss';

const Message: FC<IClientMessageData> = (props) => {

  return (
    <div className={styles['message-container']}>
      {props.from === 'self' ? (
        <div className={styles['from-self']}>
          {props.messageText}
        </div>
      ) : props.from === 'others' ? (
        <div className={styles['from-others']}>
          {props.messageText}
        </div>
      ) : ''}
    </div>
  )
};

export default Message;
