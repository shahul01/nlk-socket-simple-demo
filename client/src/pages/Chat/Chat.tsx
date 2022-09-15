import { Socket } from 'socket.io-client';
import { FC, MutableRefObject, useEffect, useRef, useState } from 'react';
import InputBtn from '../../components/InputBtn/InputBtn';
import Messages from '../../components/Messages/Messages';
import { uuid } from '../../helpers/misc';
import { TStateCount, TFrom, ESocketEventsDict, IClientMessageData, IUser } from '../../types/global';
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

  const [ isConnected, setIsConnected ] = useState(false);
  const [ messageList, setMessageList ] = useState<IClientMessageData[]>([]);
  const [ onNewMessage, setOnNewMessage ] = useState(0);
  const [ onTyping, setOnTyping ] = useState<TStateCount>(0);
  const [ isTyping, setIsTyping ] = useState(false);
  const [ isTypingText, setIsTypingText ] = useState(false);
  const [ typingUser, setTypingUser ] = useState('');
  const name = useRef(`user-${uuid(3)}`);
  const room = 'default';
  const users:IUser[] = [];
  const timeout:any = useRef(null);
  // const timeout = useRef<NodeJS.Timeout | null>(null);


  // COMMT: Socket event - Join Room
  useEffect(() => {
    props.socket.emit(
      ESocketEventsDict['joinRoom'],
      {name:name.current, room},
      (type: 'name'|'error', callbackMessage: string) => {
        if (type === 'name' && callbackMessage === name.current) {
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
  useEffect(() => {
    setIsTyping(true);
  }, [onTyping]);

  // COMMT: Socket Event - send - typing
  useEffect(() => {
    if (!isConnected) return;

    function disableTyping() {
      setIsTyping(false);
      props.socket.emit(ESocketEventsDict['stopTyping'], {room});
    };

    if (!isTyping) {
      setIsTyping(true);
      props.socket.emit(
        ESocketEventsDict['clientTyping'],
        {name:name.current, room}
      );
      timeout.current = setTimeout(disableTyping, 3000);
    } else {
      clearTimeout(timeout);
      timeout.current = setTimeout(disableTyping, 3000);
    };

    return () => {
      props.socket?.off(ESocketEventsDict['clientTyping']);
      props.socket?.off(ESocketEventsDict['stopTyping']);
    };

  }, [isConnected, onTyping]);

  // COMMT: Socket event - receive - typing
  /*
    COMMT:
    on typing -> socket emit event -> server -> other clients ->
    if typing username != currUsername istyping = true
  */
  useEffect(() => {
    props.socket.on(
      ESocketEventsDict['serverTyping'], (callbackMessage:string) => {
        // console.log('callbackMessage :>> ', callbackMessage);
        if (callbackMessage !== name.current) {
          setIsTypingText(true)
          setTypingUser(callbackMessage);
        };
      }
    )

    return () => {
      props.socket?.off(ESocketEventsDict['serverTyping']);
    }
  }, [onTyping]);

  // COMMT: Socket event - receive - stopTyping
  useEffect(() => {
    props.socket.on(
      ESocketEventsDict['stopTyping'], () => {
        setIsTypingText(false);
      }
    )

    return () => {
      props.socket?.off(ESocketEventsDict['stopTyping'])
    };
  }, []);

  // COMMT: Listen to socket and send new messages from the sent client to non sent client's messageList
  // COMMT: - via handleAddMessageToList()
  useEffect(() => {
    let messageDataHolder:IClientMessageData = {
      id: uuid(6),
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
      id: uuid(6),
      from: 'self',
      username: '',
      messageText : ''
    };

    if (from === 'self' && typeof(data) === 'string') {

      messageData = {
        id: uuid(6),
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
          {isTypingText ? <p>{typingUser || 'A user'} is typing...</p> : ''}
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
