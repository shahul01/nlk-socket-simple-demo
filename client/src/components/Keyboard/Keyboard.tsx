
import { FC, useEffect, useRef, useState } from 'react';
import { keysDict } from '../../helpers/keyboard';
import styles from './Keyboard.module.scss';

interface IKeyboardProps {
  isAuto: boolean;
  clickKey: string;
  onClickKey(currKey: string): void;
}

const Keyboard: FC<IKeyboardProps> = (props) => {
  const clickKeyRef = useRef('');

  useEffect(() => {
    console.log('props.clickKey :>> ', props.clickKey);
    if (!props?.clickKey) return;
    clickKeyRef.current = props?.clickKey;
    if (!props.isAuto) {
      props.onClickKey(clickKeyRef.current);
    } else {
      setTimeout(() => {
        props.onClickKey(clickKeyRef.current);
      }, 100);
    }
  }, [props.clickKey]);

  return (
    <div className={styles['keys-container']} >
      {
        Object.keys(keysDict)?.map((currKey, idx) => (
          <>
            <div
              key={idx}
              className={styles['key']}
              aria-hidden={true}
              onClick={() => props.onClickKey(currKey)}
            >
              {currKey}
            </div>
            {(currKey === 'p' || currKey === 'l' || currKey === 'm') && (
              <div key={idx} className={styles['line-break']}>
              </div>
            )}
          </>
        ))
      }
    </div>
  )
};

export default Keyboard;
