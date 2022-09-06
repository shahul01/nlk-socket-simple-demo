import { Socket } from 'socket.io-client';
import { FC, useEffect, useRef, useState } from 'react';
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

  const [ messageList, setMessageList ] = useState<IMessageProps[]>([]);
  const [ onNewMessage, setOnNewMessage ] = useState(0);

  // COMMT: Listen to socket and send new messages from the sent client to non sent client's messageList
  // COMMT: - via handleAddMessageToList()
  useEffect(() => {
    let messageDataHolder:IMessageProps = {
      id: uuid(),
      fromSelf: false,
      username : '',
      messageText : ''
    };

    const handleServerMessageEvent = () => {
      return handleAddMessageToList(messageDataHolder.fromSelf, messageDataHolder);
    };

    props.socket.on(ESocketEventsDict['serverMessage'], (message) => {
      if (message.fromSelf) return console.log('Client message directly added already.');
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

  // COMMT: get text from sent client and socket to add to messageList
  function handleAddMessageToList(fromSelf:boolean, data:IMessageProps|string):void {

    const newMessageData = getMessageData(fromSelf, data);
    console.log('newMessageData', newMessageData);


    if (newMessageData.messageText === '') return;

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

    setOnNewMessage(prev => prev+1);

    return;

  };

  return (
    <div>
      <p>Chat</p>
      <br /><hr /><br />
      <div className='messages-input-container'>
        <Messages messageList={messageList} onNewMessage={onNewMessage} />
        <InputBtn
          onNewMessage={(messageText)=>handleAddMessageToList(true, messageText)}
        />
      </div>
    </div>
  )
};

export default Chat;
