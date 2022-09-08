import { Socket } from 'socket.io-client';
import { FC, useEffect, useRef, useState } from 'react';
import InputBtn from '../../components/InputBtn/InputBtn';
import Messages from '../../components/Messages/Messages';
import { uuid } from '../../helpers/misc';
import { ESocketEventsDict, IClientMessageData, TFrom } from '../../types/global';
import './Chat.scss';

interface IChatProps {
  socket: Socket;
}

const Chat: FC<IChatProps> = (props) => {

  const tempData:IClientMessageData[] = [
    {
      id: 1,
      from: 'self',
      username: 'Me',
      messageText: 'Hello'
    },
    {
      id: 2,
      from: 'others',
      username: 'Others1',
      messageText: 'Hi'
    }
  ];

  const [ messageList, setMessageList ] = useState<IClientMessageData[]>([]);
  const [ onNewMessage, setOnNewMessage ] = useState(0);

  // COMMT: Listen to socket and send new messages from the sent client to non sent client's messageList
  // COMMT: - via handleAddMessageToList()
  useEffect(() => {
    let messageDataHolder:IClientMessageData = {
      id: uuid(),
      from: 'others',
      username : '',
      messageText : ''
    };

    const handleServerMessageEvent = () => {
      return handleAddMessageToList(messageDataHolder.from, messageDataHolder);
    };

    props.socket.on(ESocketEventsDict['serverMessage'], (message) => {
      if (message.from === 'self') return console.log('Client message directly added already.');
      messageDataHolder = message;
      return handleServerMessageEvent();
    });

    return () => {
      // @ts-expect-error: useEffect return type clashes with socket type
      props.socket?.off(ESocketEventsDict['serverMessage'], handleServerMessageEvent())
    };

  }, []);

  function getMessageData(from:TFrom, data:string|IClientMessageData):IClientMessageData {

    let messageData: IClientMessageData = {
      id: uuid(),
      from: 'self',
      username : '',
      messageText : ''
    };

    if (from === 'self' && typeof(data) === 'string') {

      messageData = {
        id: uuid(),
        from: from,
        username: 'Sh',
        messageText: data

      };

    } else if (typeof(data) === 'object' && 'id' in data) {

      messageData = {
        id: data.id,
        from: data.from,
        username: data.username,
        messageText: data.messageText

      };

    };

    return messageData;

  };

  // COMMT: get text from sent client and socket to add to messageList
  function handleAddMessageToList(from:TFrom, data:IClientMessageData|string):void {

    const newMessageData = getMessageData(from, data);
    console.log('newMessageData', newMessageData);


    if (newMessageData.messageText === '') return;

    const dataNotEmpty = Object.keys(newMessageData)?.length;

    if (dataNotEmpty) {
      setMessageList(prev => [...prev, newMessageData]);
    };

    // COMMT: send to server and other clients and get its sent status
    if (dataNotEmpty && from === 'self') {
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
          onNewMessage={(messageText)=>handleAddMessageToList('self', messageText)}
        />
      </div>
    </div>
  )
};

export default Chat;
