
import { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import KeyboardLines from './keyboardLines/keyboardLines';
import { keyboardLines } from '../../helpers/keyboard';
import styles from './Keyboard.module.scss';

type TCurrKeyObj = {[key:string]:string};

interface IKeyboardProps {
  // COMMT: To chat to InputBtn
  clickKey: {[key:string]:string};
  onClickKey(arg0:TCurrKeyObj): void;
  kbRef: (arg0:HTMLDivElement) => void;
}

const Keyboard: FC<IKeyboardProps> = (props) => {
  const clickKeyRef = useRef('');

  useEffect(() => {
    // COMMT: Why: Automatic KB

    const letter = props?.clickKey;
    if (!letter?.key) return;
    setTimeout(() => {
      clickKeyRef.current = letter?.key;
      props.onClickKey({key:clickKeyRef.current});

    }, 400);

    // COMMT: using RTK
    // dispatch(
    //   setSentLetter({letter:props?.clickKey})
    //   setClickedKey({key:props?.clickKey})
    // );

  }, [props.clickKey]);

  function updateKBRef(currRef:HTMLDivElement|null) {
    if (currRef) {
      props.kbRef(currRef)
    };
  };

  function handleClick(event:MouseEvent) {
    // COMMT: Why: Manual KB
    const eventTarget = event?.target as HTMLDivElement;
    const innerText = eventTarget?.innerText;
    console.log(`innerText: `, innerText);

    props.onClickKey({'key': innerText});
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
