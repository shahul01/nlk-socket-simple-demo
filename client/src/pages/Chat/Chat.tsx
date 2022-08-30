import { Socket } from 'socket.io-client';
import { FC, useEffect, useState } from 'react';
import InputBtn from '../../components/InputBtn/InputBtn';
import Messages from '../../components/Messages/Messages';
import { IMessageProps } from '../../components/Message/Message';
import { uuid } from '../../helpers/misc';
import { ESocketEventsDict } from '../../types/global';
import './Chat.scss';

interface IChatProps {
  socket: Socket;
}

const Chat: FC<IChatProps> = (props) => {

  const tempData:IMessageProps[] = [
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

  const [messageList, setMessageList] = useState<IMessageProps[]>([]);

  useEffect(() => {
    let messageDataHolder:IMessageProps = {
      id: uuid(),
      fromSelf: false,
      username : '',
      messageText : ''
    };

    const handleServerMessageEvent = () => {
      return handleAddMessageToList(false, messageDataHolder);
    };

    props.socket.on(ESocketEventsDict['serverMessage'], (message) => {
      if (message.fromSelf) return console.log('returns');
      messageDataHolder = message;
      return handleServerMessageEvent();
    });

    return () => {
      // @ts-expect-error: useEffect return type clashes with socket type
      props.socket.off(ESocketEventsDict['serverMessage'], handleServerMessageEvent())
    };

  }, []);

  function getMessageData(fromSelf:boolean, data:string|IMessageProps):IMessageProps {

    let messageData = {
      id: uuid(),
      fromSelf: true,
      username : '',
      messageText : ''
    };

    if (fromSelf && typeof(data) === 'string') {

      messageData = {
        id: uuid(),
        fromSelf: fromSelf,
        username: 'Sh',
        messageText: data

      };

    } else if (typeof(data) === 'object' && 'id' in data) {

      messageData = {
        id: data.id,
        fromSelf: data.fromSelf,
        username: data.username,
        messageText: data.messageText

      };

    };

    return messageData;

  };

  function handleAddMessageToList(fromSelf:boolean, data:IMessageProps|string):void {

    const newMessageData = getMessageData(fromSelf, data);
    console.log('newMessageData', newMessageData);

    const dataNotEmpty = Object.keys(newMessageData)?.length;

    if (dataNotEmpty) {
      setMessageList(prev => [...prev, newMessageData]);
    };

    // COMMT: send to server and other clients and get its sent status
    if (dataNotEmpty && fromSelf) {
      props.socket.emit(
        ESocketEventsDict['clientMessage'],
        newMessageData,
        (err:string) => {
          if (err) console.error('Error :>> ', err)
        }
      )
    };


    return;

  };

  return (
    <div>
      <p>Chat</p>
      <br /><hr /><br />
      <div className='messages-input-container'>
        <Messages messageList={messageList} />
        <InputBtn
          onNewMessage={(messageText)=>handleAddMessageToList(true, messageText)}
        />
      </div>
    </div>
  )
};

export default Chat;
