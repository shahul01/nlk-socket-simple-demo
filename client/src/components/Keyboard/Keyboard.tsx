/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, useEffect, useState } from 'react';
import { keysDict } from '../../helpers/keyboard';
import styles from './Keyboard.module.scss';

interface IKeyboardProps {
  onClickKey(el: string): void;
}

const Keyboard: FC<IKeyboardProps> = (props) => {

  return (
    <div className={styles['keys-container']} >
      {
        Object.keys(keysDict)?.map(el => (
          <>
            <div key={el} className={styles['key']} onClick={() => props.onClickKey(el)} >
              {el}
            </div>
            {(el === 'p' || el === 'l' || el === 'm') && (
              <div className={styles['line-break']}>
              </div>
            )}
          </>
        ))
      }
    </div>
  )
};

export default Keyboard;
