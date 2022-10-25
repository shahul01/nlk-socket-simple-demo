
import { createRef, FC, useEffect, useRef, useState } from 'react';
import { keysDict } from '../../helpers/keyboard';
import styles from './Keyboard.module.scss';

type TCurrKeyObj = {[key:string]:string};

interface IKeyboardProps {
  isAuto: boolean;
  // COMMT: To chat to InputBtn
  clickKey: string;
  onClickKey(arg0:TCurrKeyObj): void;
  allKeyRef: any;
}

const Keyboard: FC<IKeyboardProps> = (props) => {
  // < Array<HTMLDivElement|string|null> >
  const allKeyRef = useRef<any>(keysDict);
  const clickKeyRef = useRef('');

  useEffect(() => {
    props.allKeyRef(allKeyRef);
  }, [allKeyRef]);

  useEffect(() => {
    const letter = props?.clickKey;
    if (!letter) return;
    console.log('@@@@ props.clickKey :>> ', letter);

    clickKeyRef.current = letter;
    props.onClickKey({key:clickKeyRef.current});

  }, [props.clickKey]);


  return (
    <div className={styles['keys-container']} >
      {
        Object.keys(keysDict)?.map((currKey, idx) => (
          <>
            <div
              key={currKey}
              ref={el => allKeyRef.current[currKey] = el}
              className={`ripple ${styles['key']}`}
              aria-hidden={true}
              onClick={() => props.onClickKey({'key':currKey})}
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
