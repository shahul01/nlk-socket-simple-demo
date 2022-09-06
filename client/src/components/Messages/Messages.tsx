import { FC, useLayoutEffect, useEffect, useRef, useState } from 'react';
import Message, { IMessageProps } from '../Message/Message';
import styles from './Messages.module.scss';

interface IMessagesProps {
  messageList: IMessageProps[];
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
            fromSelf={currList?.fromSelf}
            username={currList?.username}
            messageText={currList?.messageText}
          />
        </div>
      ))}
    </div>
  )
};

export default Messages;
