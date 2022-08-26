import { FC, useEffect, useState } from 'react';

interface IInputBtnProps {
  onNewMessage: (e:string) => void;
}

const InputBtn: FC<IInputBtnProps> = (props) => {
  const [ newMessageText, setNewMessageText ] = useState('');

  function handleSubmit() {
    console.log('newMessageText :>> ', newMessageText);
    props.onNewMessage(newMessageText);
    return setNewMessageText('');
  };

  return (
    <div className='flex justify-center align-middle'>
      <input
        type="text"
        value={newMessageText}
        onChange={e=>setNewMessageText(e.target?.value)}
        placeholder="Type here..."
      />
      <button
        onClick={handleSubmit}
      >
        ⮞
      </button>
    </div>
  )
};

export default InputBtn;
