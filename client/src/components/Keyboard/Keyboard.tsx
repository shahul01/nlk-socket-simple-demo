
import { FC, Fragment, MouseEvent, MutableRefObject, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { keysDict } from '../../helpers/keyboard';
import { setClickedKeyRdx } from '../LinkMock/LinkMockSlice';
import { RootState } from '../../store/store';
import styles from './Keyboard.module.scss';

type TCurrKeyObj = {[key:string]:string};

interface IKeyboardProps {
  // COMMT: To chat to InputBtn
  clickKey: {[key:string]:string};
  onClickKey(arg0:TCurrKeyObj): void;
  kbRef: (arg0:HTMLDivElement) => void;
}

const Keyboard: FC<IKeyboardProps> = (props) => {
  const localKB = Object.keys({...keysDict});
  const clickKeyRef = useRef('');
  const dispatch = useDispatch();
  const { clickedKeyRdx, cursorSpeed } = useSelector((state:RootState) => state.linkMock);

  useEffect(() => {
    // COMMT: Why: Automatic KB

    // const letter = props?.clickKey;
    console.log(`2. KB clicked : `, clickedKeyRdx?.key);
    if (!clickedKeyRdx?.key) return;
    setTimeout(() => {
      clickKeyRef.current = clickedKeyRdx?.key;
      // console.log(`clicked KB: `, clickKeyRef.current);
      props.onClickKey({key:clickKeyRef.current});

    }, ( cursorSpeed ));

    // COMMT: using RTK
    // dispatch(
    //   setClickedKey({key:props?.clickKey})
    // );

    // props.clickKey
  }, [clickedKeyRdx]);

  function handleClick(event:MouseEvent) {
    // COMMT: Why: Manual KB
    const eventTarget = event?.target as HTMLDivElement;
    const innerText = eventTarget?.innerText;
    console.log(`KB clicked: `, innerText);
    dispatch(setClickedKeyRdx({key: innerText}));
    // props.onClickKey({'key': innerText});
  };


  return (
    <div  className={styles['keyboard']}>
      {
        localKB.map(currKey => (
          <Fragment key={currKey} >
            <div
              ref={(ref:HTMLDivElement) => props.kbRef(ref)}
              className={`button ripple ${styles['key']}`}
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
