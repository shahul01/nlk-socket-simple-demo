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
    })
  }, [props.socket]);

  function newMessageData(messageText:string):IMessageProps {

    return {
      id: uuid(),
      fromSelf: true,
      username: 'Sh',
      messageText: messageText
    };

  };

  function handleAddMessageToList(messageText:string) {
    console.log('handleAddMessageToList messageText', messageText);
    const newData = newMessageData(messageText);
    setMessageList(prev => [...prev, newData]);
  };

  return (
    <div>
      <p>Chat</p>
      <br /><hr /><br />
      <Messages messageList={messageList} />
      <InputBtn
        // newMessageText={newMessageText}
        // setNewMessageText={setNewMessageText}
        onNewMessage={handleAddMessageToList}
      />
    </div>
  )
};

export default Chat;
