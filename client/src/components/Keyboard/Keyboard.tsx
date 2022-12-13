
import { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import KeyboardLines from './keyboardLines/keyboardLines';
import { keyboardLines } from '../../helpers/keyboard';
import styles from './Keyboard.module.scss';
import { RootState } from '../../store/store';
import { setClickedKeyRdx } from '../LinkMock/LinkMockSlice';

type TCurrKeyObj = {[key:string]:string};

interface IKeyboardProps {
  // COMMT: To chat to InputBtn
  clickKey: {[key:string]:string};
  onClickKey(arg0:TCurrKeyObj): void;
  kbRef: (arg0:HTMLDivElement) => void;
}

const Keyboard: FC<IKeyboardProps> = (props) => {
  const clickKeyRef = useRef('');
  const dispatch = useDispatch();
  const { clickedKeyRdx, cursorSpeed } = useSelector((state:RootState) => state.linkMock);

  useEffect(() => {
    // COMMT: Why: Automatic KB

    // const letter = props?.clickKey;
    console.log(`2. KB clicked : `, clickedKeyRdx?.key);
    if (!clickedKeyRdx?.key) return;
    setTimeout(() => {
      clickKeyRef.current = clickedKeyRdx?.key;
      // console.log(`clicked KB: `, clickKeyRef.current);
      props.onClickKey({key:clickKeyRef.current});

    }, ( cursorSpeed ));

    // COMMT: using RTK
    // dispatch(
    //   setClickedKey({key:props?.clickKey})
    // );

    // props.clickKey
  }, [clickedKeyRdx]);

  function updateKBRef(currRef:HTMLDivElement|null) {
    if (currRef) {
      props.kbRef(currRef)
    };
  };

  function handleClick(event:MouseEvent) {
    // COMMT: Why: Manual KB
    const eventTarget = event?.target as HTMLDivElement;
    const innerText = eventTarget?.innerText;
    console.log(`KB clicked: `, innerText);
    dispatch(setClickedKeyRdx({key: innerText}));
    // props.onClickKey({'key': innerText});
  };


  return (
    <div  className={styles['keyboard']}>
      {/* // COMMT: QWERTYUIOP */}
      <KeyboardLines
        currLine={keyboardLines[0]}
        handleClick={handleClick}
        ref={(currRef) => updateKBRef(currRef)}
      />
      <KeyboardLines
        currLine={keyboardLines[1]}
        handleClick={handleClick}
        ref={(currRef) => updateKBRef(currRef)}
      />
      <KeyboardLines
        currLine={keyboardLines[2]}
        handleClick={handleClick}
        ref={(currRef) => updateKBRef(currRef)}
      />
      <KeyboardLines
        currLine={keyboardLines[3]}
        handleClick={handleClick}
        ref={(currRef) => updateKBRef(currRef)}
      />
    </div>
  )
};

export default Keyboard;
