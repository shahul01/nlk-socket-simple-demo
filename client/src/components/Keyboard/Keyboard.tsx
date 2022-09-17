/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, useEffect, useState } from 'react';
import styles from './Keyboard.module.scss';

interface IKeyboardProps {
}

const Keyboard: FC<IKeyboardProps> = (props) => {
  const keysDict:{[key:string]:string} = {
    'q':'q', 'w':'w', 'e':'e', 'r':'r', 't':'t', 'y':'y', 'u':'u', 'i':'i', 'o':'o', 'p':'p',
    'a':'a', 's':'s', 'd':'d', 'f':'f', 'g':'g', 'h':'h', 'j':'j', 'k':'k', 'l':'l',
    'z':'z', 'x':'x', 'c':'c', 'v':'v', 'b':'b', 'n':'n', 'm':'m',
    '$':'$', ',':',', 'Space':' ', '.':'.', '↵':'Enter'
  };

  return (
    <div className={styles['keys-container']} >
      {
        Object.keys(keysDict)?.map(el => (
          <>
            <div key={el} className={styles['key']} onClick={():void => console.log(keysDict[el])} >
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
