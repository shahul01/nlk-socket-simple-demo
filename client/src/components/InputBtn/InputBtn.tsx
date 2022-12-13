import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import styles from './InputBtn.module.scss';
import { TStateCount } from '../../types/global';

interface IInputBtnProps {
  onNewMessage: (e:string) => void;
  clickedKey: {key:string};
  setOnTyping: React.Dispatch<React.SetStateAction<TStateCount>>;
}

const InputBtn: FC<IInputBtnProps> = (props) => {
  const { clickedKeyRdx } = useSelector((state:RootState) => state.linkMock);
  const [ newMessageText, setNewMessageText ] = useState('');


  useEffect(() => {
    if (!clickedKeyRdx?.key) return;
    handleChange(true, null);

  }, [clickedKeyRdx]);

  function handleChange(isAuto:boolean, e: ChangeEvent<HTMLTextAreaElement>|null) {
    if (isAuto) setNewMessageText(prev => prev + clickedKeyRdx?.key);
    if (!isAuto && e) setNewMessageText(e?.target?.value);
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
        placeholder="Type here..."
        value={newMessageText}
        onChange={(e) => handleChange(false, e)}
      />
      <button
        className='ripple'
        onClick={handleSubmit}
      >
        ⮞
      </button>
    </div>
  )
};

export default InputBtn;
