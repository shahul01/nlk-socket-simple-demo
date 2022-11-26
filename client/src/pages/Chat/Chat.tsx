import { Socket } from 'socket.io-client';
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import Messages from '../../components/Messages/Messages';
import InputBtn from '../../components/InputBtn/InputBtn';
import Cursor from '../../components/Cursor/Cursor';
import LinkMock from '../../components/LinkMock/LinkMock';
// import Keyboard from '../../components/Keyboard/Keyboard';
import { setIsAuto } from '../../components/LinkMock/LinkMockSlice';
import { keysDict } from '../../helpers/keyboard';
import { uuid } from '../../helpers/misc';
import { TStateCount, TFrom, ESocketEventsDict, IClientMessageData, IUser } from '../../types/global';
import styles from './Chat.module.scss';
import { RootState } from '../../store/store';

interface IChatProps {
  socket: Socket;
}

const Chat: FC<IChatProps> = (props) => {

  const dispatch = useDispatch();
  // const tempData:IClientMessageData[] = [
  //   { id: 1, from: 'self', username: 'Me', messageText: 'Hello' }
  // ];
  const timeout:any = useRef(null);
  const firstRender = useRef({joinRoom:true});
  // const { isAuto } = useSelector((state:RootState) => state.linkMock);
  const [ isConnected, setIsConnected ] = useState(false);
  const [ messageList, setMessageList ] = useState<IClientMessageData[]>([]);
  const [ onNewMessage, setOnNewMessage ] = useState(0);
  const [ onTyping, setOnTyping ] = useState<TStateCount>(0);
  const [ isTyping, setIsTyping ] = useState(false);
  const [ isTypingText, setIsTypingText ] = useState(false);
  const [ typingUser, setTypingUser ] = useState('');
  const name = useRef(`user-${uuid(3)}`);
  const room = 'default';
  // const users:IUser[] = [];
  const isKeyboard = true;
  const [ clickedKey, setClickedKey ] = useState({key: ''});
  // const timeout = useRef<NodeJS.Timeout | null>(null);


  // COMMT: Socket event - Join Room
  useEffect(() => {

    if (firstRender.current.joinRoom) {
      firstRender.current.joinRoom = false;
    } else {

      props.socket.emit(
        ESocketEventsDict['joinRoom'],
        {name:name.current, room},
        (type: 'name'|'error', callbackMessage: string) => {
          if (type === 'name' && callbackMessage === name.current) {
            setIsConnected(true);
          };
          if (type === 'error') console.error('Error: ', callbackMessage);
        }
      );

    };


    return () => {
      // handleJoinRoom()
      props.socket?.off(ESocketEventsDict['joinRoom']);
    };

  }, []);

  // COMMT: Toggle isTyping when this client types
  useEffect(() => {
    setIsTyping(true);
  }, [onTyping]);

  // useEffect(() => {
  //   console.log(`isTyping: `, isTyping);
  // }, [isTyping]);

  // COMMT: Socket Event - send - typing
  useEffect(() => {
    if (!isConnected) return;

    function disableTyping() {
      props.socket.emit(
        ESocketEventsDict['isTyping'],
        {name:name.current, room, isTyping:false}
      );
      setIsTypingText(false);

    };

    if (!isTyping) {
      // COMMT: setIsTyping true
      setIsTyping(prev => !prev);
      props.socket.emit(
        ESocketEventsDict['isTyping'],
        {name:name.current, room, isTyping:true}
      );
      timeout.current = setTimeout(disableTyping, 2000);

    } else {
      // COMMT: setIsTyping false
      setIsTyping(prev => !prev);
      clearTimeout(timeout);

    };

    return () => {
      props.socket?.off(ESocketEventsDict['isTyping']);
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
      ESocketEventsDict['isTyping'],
      (name:string, isNewTyping:boolean) => {
        setIsTyping(isNewTyping);
        setIsTypingText(isNewTyping);
        setTypingUser(name);
      }

    );

    return () => {
      props.socket?.off(ESocketEventsDict['isTyping']);
    };
  }, [onTyping]);

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

  useEffect(() => {
    // console.log(`#=#= clickedKey Chat: `, clickedKey);

  }, [clickedKey]);

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

    // console.log('newMessageData', newMessageData);

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

  function handleClickKey(currKey: any) {
    // COMMT: TODO: add toggle to symbol KB layout
    if (keysDict[currKey]==='$') return;
    // COMMT: TODO: send data
    if (keysDict[currKey]==='Enter') return;
    // COMMT: TODO: send space

    // console.log(`currKey: `, currKey);

    if (currKey.key?.length === 0) {
      setClickedKey({key:keysDict[currKey.key]});
    } else {

      // COMMT: Auto mode
      currKey.key?.split('')?.forEach((currLetter:any) => {
        let newVal = ' ';
        // COMMT: key ref instead of key
        if (typeof(keysDict[currLetter]) === 'object') {
          // @ts-expect-error 'innerText' not exist on 'string'.
          newVal = keysDict[currLetter]?.innerText;
        } else if (typeof(keysDict[currLetter]) === 'string') {
          newVal = keysDict[currLetter];
        };

        setClickedKey({key:newVal});
      });
    };
    return;

  };

  function handleCheckbox(e:ChangeEvent<HTMLInputElement>) {
    const value = e?.target?.checked;
    // setIsAuto(value);
    dispatch(
      setIsAuto(value)
    );
  };


  return (
    <div>
      <p>Chat</p>
      <br /><hr /><br />
      <div className={styles['chat-chart-container']}>
        <div className={styles['chat-container']}>
          <Messages messageList={messageList} onNewMessage={onNewMessage} />

          <div >
            <div>
              {isTypingText ? <p>{typingUser || 'A user'} is typing...</p> : ''}
            </div>
            <InputBtn
              clickedKey={clickedKey}
              onNewMessage={(messageText)=>handleAddMessageToList('self', messageText)}
              setOnTyping={setOnTyping}
            />
            <Cursor />
            {
              isKeyboard && (
                <LinkMock
                  onClickKey={handleClickKey}
                />
              )
            }
          </div>

        </div>

        <div className={styles['chart-container']}>
            <div className={styles['checkbox-text']}>
              <input type="checkbox" onChange={handleCheckbox} />
              <span>Enable Automatic Keyboard</span>
            </div>
        </div>

      </div>
    </div>
  )
};

export default Chat;
