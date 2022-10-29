
import { createRef, FC, MouseEventHandler, useEffect, useRef, useState } from 'react';
import { keysDict } from '../../helpers/keyboard';
import styles from './Keyboard.module.scss';

type TCurrKeyObj = {[key:string]:string};

interface IKeyboardProps {
  isAuto: boolean;
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
    clickKeyRef.current = letter?.key;
    props.onClickKey({key:clickKeyRef.current});

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
    <div className={styles['keys-container']} >
      {
        Object.keys(localKB)?.map((currKey, idx) => (
          <>
            <div
              key={currKey}
              ref={el => allKeyRef.current[currKey] = el}
              className={`ripple ${styles['key']}`}
              aria-hidden={true}
              onClick={handleClick}
            >
              {currKey}
            </div>
            {(currKey === 'p' || currKey === 'l' || currKey === 'm') && (
              <div key={currKey+'line-break'} className={styles['line-break']}>
              </div>
            )}
          </>
        ))
      }
    </div>
  )
};

export default Keyboard;
