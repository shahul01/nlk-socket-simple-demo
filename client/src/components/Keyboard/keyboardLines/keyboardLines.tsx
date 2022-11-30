import { FC, forwardRef, LegacyRef, MouseEventHandler, MutableRefObject, useEffect, useState } from 'react';
import styles from './keyboardLines.module.scss';

interface IKeyboardLinesProps {
  currLine: string[];
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
