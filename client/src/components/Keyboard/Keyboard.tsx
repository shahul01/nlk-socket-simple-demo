
import { FC, Fragment, MouseEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { keysDict } from '../../helpers/keyboard';
import { setClickedKeyRdx } from '../LinkMock/LinkMockSlice';
import styles from './Keyboard.module.scss';

interface IKeyboardProps {
  // COMMT: To chat to InputBtn
  kbRef: (arg0:HTMLDivElement) => void;
}

const Keyboard: FC<IKeyboardProps> = (props) => {
  const localKB = Object.keys({...keysDict});
  const dispatch = useDispatch();

  function handleClick(event:MouseEvent) {
    const { innerText } = event?.target as HTMLDivElement;

    // console.log(`2. KB clicked: `, innerText);
    return dispatch(
      setClickedKeyRdx({ key: keysDict[innerText] })
    );
  };


  return (
    <div  className={styles['keyboard']}>
      {
        localKB.map(currKey => (
          <Fragment key={currKey} >
            <div
              ref={(ref:HTMLDivElement) => props.kbRef(ref)}
              className={
                `button ripple ${styles['key']} ${currKey=='Space' ? styles['space'] : ''}`
              }
              aria-hidden={true}
              onClick={handleClick}
            >
              {currKey}
            </div>

            {(
              currKey === 'p'
              || currKey === 'l'
              || currKey === 'm'
            ) && (
              <div className={styles['line-break']}></div>
            )}
          </Fragment>
        ))
      }
    </div>
  )
};

export default Keyboard;
