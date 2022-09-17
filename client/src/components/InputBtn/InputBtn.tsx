import React, { FC, useEffect, useState } from 'react';
import styles from './InputBtn.module.scss';

interface IInputBtnProps {
  onNewMessage: (e:string) => void;
  onClickKey: any;
  setOnTyping: any;
}

const InputBtn: FC<IInputBtnProps> = (props) => {
  const [ newMessageText, setNewMessageText ] = useState('');

  useEffect(() => {
    console.log('props.onClickKey :>> ', props.onClickKey);
    handleChange(false, props.onClickKey);
  }, [props.onClickKey]);

  function handleChange(isManual:boolean, e: React.ChangeEvent<HTMLInputElement>|string) {
    if (isManual && typeof(e)!=='string') setNewMessageText(e?.target?.value);
    if (!isManual) setNewMessageText(prev => prev + e);
    props.setOnTyping((prev:number) => prev+1);
    return;
  };

  function handleSubmit() {
    props.onNewMessage(newMessageText);
    return setNewMessageText('');
  };

  return (
    <div className={styles['input-btn-container']}>
      <input
        type="text"
        value={newMessageText}
        onChange={(e) => handleChange(true, e)}
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
