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
      room: 'default',
      messageText: 'Hello'
    },
    {
      id: 2,
      from: 'others',
      username: 'Others1',
      room: 'default',
      messageText: 'Hi'
    }
  ];

  const [ messageList, setMessageList ] = useState<IClientMessageData[]>([]);
  const [ onNewMessage, setOnNewMessage ] = useState(0);
  const name = `user-${uuid(3)}`;
  const room = 'default';
  const users = [];

  // COMMT: Join Room
  useEffect(() => {
    props.socket.emit(
      ESocketEventsDict['joinRoom'],
      {name, room},
      (err: string|null) => {
        if (err) console.error('Error: ',err)
      }
    );

    return () => {
      // handleJoinRoom()
      // // @ts-expect-error: useEffect return type clashes with socket type
      props.socket?.off(ESocketEventsDict['joinRoom']);

    };

  }, []);

  // COMMT: Listen to socket and send new messages from the sent client to non sent client's messageList
  // COMMT: - via handleAddMessageToList()
  useEffect(() => {
    let messageDataHolder:IClientMessageData = {
      id: uuid(6),
      from: 'others',
      username : '',
      room: room,
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
      id: uuid(6),
      from: 'self',
      username: '',
      room: room,
      messageText : ''
    };

    if (from === 'self' && typeof(data) === 'string') {

      messageData = {
        id: uuid(6),
        from: from,
        username: 'Sh',
        room: room,
        messageText: data

      };

    } else if (typeof(data) === 'object' && 'id' in data) {

      messageData = {
        id: data.id,
        from: data.from,
        username: data.username,
        room: room,
        messageText: data.messageText

      };

    };

    return messageData;

  };

  // COMMT: get text from sent client and socket to add to messageList
  function handleAddMessageToList(from:TFrom, data:IClientMessageData|string):void {

    const newMessageData = getMessageData(from, data);

    if (newMessageData.messageText === '') return;

    console.log('newMessageData', newMessageData);

    const dataNotEmpty = Object.keys(newMessageData)?.length;

    if (dataNotEmpty) {
      setMessageList(prev => [...prev, newMessageData]);
    };

    // COMMT: send to server and other clients and get its sent status
    if (dataNotEmpty && from === 'self') {
      props.socket.emit(
        ESocketEventsDict['clientMessage'],
        newMessageData,
        (err:string|null) => {
          if (err) console.error('Error: ', err)
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
