import { FC, useLayoutEffect, useEffect, useRef, useState } from 'react';
import Message from '../Message/Message';
import { IClientMessageData } from '../../types/global';
import styles from './Messages.module.scss';

interface IMessagesProps {
  messageList: IClientMessageData[];
  onNewMessage: number;
}

const Messages: FC<IMessagesProps> = (props) => {

  const MessageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    scrollToBottom();
  }, [props?.onNewMessage]);

  function scrollToBottom() {
    if (MessageRef?.current) {

      MessageRef.current.scrollTo({
        top: MessageRef.current?.scrollHeight,
        behavior: 'smooth',
      });

    };

    return;
  };

  return (
    <div ref={MessageRef} className={styles['messages-container']}>
      {props.messageList?.map(currList => (
        <div className={styles['message-parent-container']} key={currList?.id}>
          <Message
            id={currList?.id}
            from={currList?.from}
            username={currList?.username}
            messageText={currList?.messageText}
          />
        </div>
      ))}
    </div>
  )
};

export default Messages;
