
import { FC, useEffect, useState } from 'react';
import { keysDict } from '../../helpers/keyboard';
import { uuid } from '../../helpers/misc';
import styles from './Keyboard.module.scss';

interface IKeyboardProps {
  onClickKey(el: string): void;
}

const Keyboard: FC<IKeyboardProps> = (props) => {

  return (
    <div className={styles['keys-container']} >
      {
        Object.keys(keysDict)?.map((el, idx) => (
          <>
            <div
              key={uuid(6)}
              className={styles['key']}
              aria-hidden={true}
              onClick={() => props.onClickKey(el)}
            >
              {el}
            </div>
            {(el === 'p' || el === 'l' || el === 'm') && (
              <div key={uuid(6)} className={styles['line-break']}>
              </div>
            )}
          </>
        ))
      }
    </div>
  )
};

export default Keyboard;
