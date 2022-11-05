import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementKeyClickCount } from '../LinkMock/LinkMockSlice';
import { RootState } from '../../store/store';
import styles from './InputBtn.module.scss';

interface IInputBtnProps {
  onNewMessage: (e:string) => void;
  clickedKey: any;
  setOnTyping: any;
}

const InputBtn: FC<IInputBtnProps> = (props) => {
  const dispatch = useDispatch();
  const firstRender = useRef(true);
  const { sentLetter, isAuto } = useSelector((state:RootState) => state.linkMock);
  // const { text, currTextIdx } = useSelector((state:RootState) => state.text);
  const temp = {text: '', currTextIdx: 0};
  const { text, currTextIdx } = temp;
  const [ newMessageText, setNewMessageText ] = useState('');

  useEffect(() => {
    // console.log(`props InputBtn: `, props);

  }, [props]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    };

    if (!props.clickedKey?.key) return;
    console.log(`sentLetter: `, sentLetter);
    updateTextValue();

  }, [sentLetter.letter]);

  useEffect(() => {
    if (!props.clickedKey?.key) return;
    // COMMT: Auto KB
    handleChange(true, props.clickedKey.key);

  }, [props.clickedKey]);


  function updateTextValue() {
    if (!props.clickedKey?.key) return;
    // textValueRef.current += sentLetter?.letter;
    setNewMessageText(prev=>prev + sentLetter?.letter);

    if (text[currTextIdx] === sentLetter?.letter) {
      // COMMT: Doesnt even work!
      // dispatch(
      //   incrementKeyClickCount()
      // );
    };

    return;
  };

  function handleChange(isAuto:boolean, e: any) {
    if (isAuto) setNewMessageText(prev => prev + e);
    if (!isAuto && typeof(e)!=='string') setNewMessageText(e?.target?.value);
    props.setOnTyping((prev:number) => prev+1);
    return;
  };

  function handleSubmit() {
    props.onNewMessage(newMessageText);
    return setNewMessageText('');
  };

  return (
    <div className={styles['input-btn-container']}>
      <textarea
        rows={3}
        placeholder="Type here..."
        value={newMessageText}
        onChange={(e) => handleChange(false, e)}
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
