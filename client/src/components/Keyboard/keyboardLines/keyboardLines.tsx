import { FC, forwardRef, LegacyRef, MouseEventHandler, MutableRefObject, useEffect, useState } from 'react';
import styles from './keyboardLines.module.scss';

// type TAllKeyRef = MutableRefObject<{ [x: string]: string; }>;

interface IKeyboardLinesProps {
  currLine: string[];
  allKeyRef: MutableRefObject<{[currKey:string]:HTMLDivElement|string|null}>;
  handleClick: MouseEventHandler<HTMLDivElement>;
}

const KeyboardLines = forwardRef((props:IKeyboardLinesProps,ref:LegacyRef<HTMLDivElement>) => {

  return (

    <div className={styles['keyboard-lines']}>
      {
        props.currLine?.map((currKey) => (
          <div
            key={currKey}
            ref={ref}
            className={`ripple ${styles['key']}`}
            aria-hidden={true}
            onClick={props.handleClick}
            >
            {currKey}
          </div>
        ))
      }
    </div>
  )
});

KeyboardLines.displayName = 'KeyboardLines';
export default KeyboardLines;
