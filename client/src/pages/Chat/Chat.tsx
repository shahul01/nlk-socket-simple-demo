import { Socket } from 'socket.io-client';
import { FC, useEffect, useState } from 'react';
import InputBtn from '../../components/InputBtn/InputBtn';
import Messages from '../../components/Messages/Messages';
import { IMessageProps } from '../../components/Message/Message';
import { uuid } from '../../helpers/misc';
import { ESocketEventsDict } from '../../types/global';

interface IChatProps {
  socket: Socket
}

const Chat: FC<IChatProps> = (props) => {

  const tempData:IMessageProps[] = [
    // {
    //   id: 1,
    //   fromSelf: true,
    //   username: 'Me',
    //   messageText: 'Hello'
    // },
    {
      id: 2,
      fromSelf: false,
      username: 'Others1',
      messageText: 'Hi'
    }
  ];
  const [messageList, setMessageList] = useState<IMessageProps[]>(tempData);
  // const [ newMessageText, setNewMessageText ] = useState('');

  useEffect(() => {
    props.socket.on(ESocketEventsDict['serverMessage'], (message) => {
      console.log('message from Server :>> ', message);
      handleAddMessageToList(false, message)
    });

    // return () => Socket.off(ESocketEventsDict['serverMessage', handleAddMessageToList()]);

  }, [props.socket]);

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

      }

    };

    return messageData;

  };

  function handleAddMessageToList(fromSelf:boolean, data:string|IMessageProps) {

    const newMessageData = getMessageData(fromSelf, data);

    const dataNotEmpty = Object.keys(newMessageData)?.length;

    if (dataNotEmpty) {
      setMessageList(prev => [...prev, newMessageData]);
    };

  };

  return (
    <div>
      <p>Chat</p>
      <br /><hr /><br />
      <Messages messageList={messageList} />
      <InputBtn
        onNewMessage={(messageText)=>handleAddMessageToList(true, messageText)}
      />
    </div>
  )
};

export default Chat;