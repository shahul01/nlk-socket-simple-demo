import React, { FC, useEffect, useState } from 'react';
import styles from './InputBtn.module.scss';

interface IInputBtnProps {
  onNewMessage: (e:string) => void;
  setOnTyping: (arg:number) => void;
}

const InputBtn: FC<IInputBtnProps> = (props) => {
  const [ newMessageText, setNewMessageText ] = useState('');

  function handleSubmit() {
    console.log('newMessageText :>> ', newMessageText);
    props.onNewMessage(newMessageText);
    return setNewMessageText('');
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewMessageText(e.target?.value);
    // @ts-expect-error: Argument '(prev: number) => number' vs parameter 'number'
    props.setOnTyping((prev: number) => prev+1);
    return;
  };

  return (
    <div className={styles['input-btn-container']}>
      <input
        type="text"
        value={newMessageText}
        onChange={handleChange}
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
