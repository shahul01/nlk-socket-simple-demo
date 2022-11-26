
import { createRef, FC, MouseEventHandler, useEffect, useRef, useState } from 'react';
import KeyboardLines from './keyboardLines/keyboardLines';
import { keysDict, keyboardLines } from '../../helpers/keyboard';
import styles from './Keyboard.module.scss';

type TCurrKeyObj = {[key:string]:string};

interface IKeyboardProps {
  // COMMT: To chat to InputBtn
  clickKey: {[key:string]:string};
  onClickKey(arg0:TCurrKeyObj): void;
  allKeyRef: any;
}

const Keyboard: FC<IKeyboardProps> = (props) => {
  // < Array<HTMLDivElement|string|null> >
  const localKB = {...keysDict};
  const allKeyRef = useRef<any>(localKB);
  const clickKeyRef = useRef('');

  useEffect(() => {
    props.allKeyRef(allKeyRef);
  }, [allKeyRef]);

  useEffect(() => {
    // COMMT: Why: Automatic KB

    const letter = props?.clickKey;
    if (!letter?.key) return;
    setTimeout(() => {
      clickKeyRef.current = letter?.key;
      props.onClickKey({key:clickKeyRef.current});

    }, 350);

    // COMMT: using RTK
    // dispatch(
    //   setSentLetter({letter:props?.clickKey})
    //   setClickedKey({key:props?.clickKey})
    // );

  }, [props.clickKey]);

  function handleClick(event:any) {
    // COMMT: Why: Manual KB
    const {innerText} = event.target as HTMLElement;
    props.onClickKey({'key': innerText});

    console.log(`innerText: `, innerText);

  };


  return (
    <div  className={styles['keyboard']}>
      <KeyboardLines
        currLine={keyboardLines[0]}
        allKeyRef={allKeyRef}
        handleClick={handleClick}
        />
      <KeyboardLines
        currLine={keyboardLines[1]}
        allKeyRef={allKeyRef}
        handleClick={handleClick}
        />
      <KeyboardLines
        currLine={keyboardLines[2]}
        allKeyRef={allKeyRef}
        handleClick={handleClick}
        />
      <KeyboardLines
        currLine={keyboardLines[3]}
        allKeyRef={allKeyRef}
        handleClick={handleClick}
        />
    </div>
  )
};

export default Keyboard;
