import { MouseEventHandler, useEffect, useState } from 'react';
import styles from './keyboardLines.module.scss';

interface IKeyboardLinesProps {
  currLine: string[];
  allKeyRef: any;
  handleClick: MouseEventHandler<HTMLDivElement> | undefined;
}

const KeyboardLines = (props:IKeyboardLinesProps) => {

  return (

    <div className={styles['keyboard-lines']}>
      {
        props.currLine?.map((currKey, idx) => (
          <div
            key={idx}
            ref={el => props.allKeyRef.current[currKey] = el}
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
};


export default KeyboardLines;