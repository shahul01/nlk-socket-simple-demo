import { Socket } from 'socket.io-client';
import { FC, useEffect, useRef, useState } from 'react';
import InputBtn from '../../components/InputBtn/InputBtn';
import Messages from '../../components/Messages/Messages';
import { uuid } from '../../helpers/misc';
import { TStateCount, TFrom, ESocketEventsDict, IClientMessageData } from '../../types/global';
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

  const [ isConnected, setIsConnected ] = useState(false);
  const [ messageList, setMessageList ] = useState<IClientMessageData[]>([]);
  const [ onNewMessage, setOnNewMessage ] = useState(0);
  const [ onTyping, setOnTyping ] = useState<TStateCount>(0);
  const [ isTyping, setIsTyping ] = useState(true);
  const [ isTypingText, setIsTypingText ] = useState(false);
  const [ lastTypingTime, setLastTypingTime ] = useState(new Date().getTime());
  const typingTime = 400; // COMMT: in ms
  const name = `user-${uuid(3)}`;
  const room = 'default';
  const users = [];
  const [tempCount, setTempCount] = useState(0);


  // COMMT: Socket event - Join Room
  useEffect(() => {
    props.socket.emit(
      ESocketEventsDict['joinRoom'],
      {name, room},
      (type: 'name'|'error', callbackMessage: string) => {
        if (type === 'name' && callbackMessage === name) {
          // console.log('### CONN ###', name)
          // setIsTyping(true);
          setIsConnected(true);
        };
        if (type === 'error') console.error('Error: ', callbackMessage);
      }
    );

    return () => {
      // handleJoinRoom()
      // // @ts-expect-error: useEffect return type clashes with socket type
      props.socket?.off(ESocketEventsDict['joinRoom']);

    };

  }, []);

  // COMMT: Toggle isTyping when this client types
  // useEffect(() => {
  //   if (onTyping >=1) {
  //     setIsTyping(true);
  //   };
  // }, [onTyping]);

  // COMMT: Socket Event - send - typing
  useEffect(() => {
    console.log('#### Changes ####', isConnected, isTyping);
    if (!isConnected) return;
    if (!isTyping) {
      setIsTyping(true);
      props.socket.emit(
        ESocketEventsDict['clientTyping'],
        {name, room}
      );
    };
    setLastTypingTime(new Date().getTime());

    setTimeout(() => {
      const currTypingTimer = new Date().getTime();
      const timeDiff = currTypingTimer - lastTypingTime;
      console.log('time', timeDiff, typingTime);
      if (isTyping && timeDiff >= typingTime) {
        props.socket.emit(
          ESocketEventsDict['stopTyping'],
          {name, room}
        );
        if (tempCount <= 3) setIsTyping(false) ;
        setTempCount(p=>p+1);
        console.log('setIsTyping is set to false')
      };
    }, typingTime)

    return () => {
      props.socket?.off(ESocketEventsDict['clientTyping']);
    };

  }, [onTyping]);


  /*

    on typing -> socket emit event -> server -> other clients ->
    if typing username != currUsername istyping = true

  */

  // COMMT: props socket event - receive - typing
  useEffect(() => {
    props.socket.on(
      ESocketEventsDict['serverTyping'], (callbackMessage:string) => {
        console.log('callbackMessage :>> ', callbackMessage);
        if (callbackMessage !== name) setIsTypingText(true);
      }
    )

    return () => {
      props.socket?.off(ESocketEventsDict['serverTyping']);
    }
  }, [onTyping]);

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
        <div>
          {isTypingText ? <p>A user is typing...</p> : ''}
        </div>
        <InputBtn
          onNewMessage={(messageText)=>handleAddMessageToList('self', messageText)}
          setOnTyping={setOnTyping}
        />
      </div>
    </div>
  )
};

export default Chat;
