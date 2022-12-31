import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { TStateCount } from '../../types/global';
import ArrowRightSend from '../../assets/icons/svg/arrowRightSend.svg';
import styles from './InputBtn.module.scss';

interface IInputBtnProps {
  onNewMessage: (e:string) => void;
  setOnTyping: React.Dispatch<React.SetStateAction<TStateCount>>;
}

const InputBtn: FC<IInputBtnProps> = (props) => {
  const { isAuto, clickedKeyRdx, cursorSpeed } = useSelector((state:RootState) => state.linkMock);
  const [ newMessageText, setNewMessageText ] = useState('');

  useEffect(() => {
    if (!clickedKeyRdx?.key) return;
    handleChange(null);

  }, [clickedKeyRdx]);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>|null) {
    if (e) {
      // COMMT: Manual typing
      setNewMessageText(e?.target?.value);
    } else if (!isAuto) {
      // COMMT: Manual clicking on screen kb
      setNewMessageText(prev => prev + clickedKeyRdx?.key);
    } else {
      // COMMT: Auto clicking
      setTimeout(() => {
        setNewMessageText(prev => prev + clickedKeyRdx?.key);
      }, cursorSpeed);
    };

    return props.setOnTyping((prev:number) => prev+1);
  };

  function handleSubmit() {
    props.onNewMessage(newMessageText);
    return setNewMessageText('');
  };

  return (
    <div className={styles['input-btn-container']}>
      <textarea
        placeholder="Type here..."
        value={newMessageText}
        onChange={(e) => handleChange(e)}
      />
      <button
        className='ripple'
        onClick={handleSubmit}
      >
        <img
          className={styles['send-icon']}
          src={ArrowRightSend}
          alt='Send Icon'
        />

      </button>
    </div>
  )
};

export default InputBtn;
