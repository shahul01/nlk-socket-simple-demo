/*
 * COMMT:
 * Why: Auto typing.
 * This is a simple NeuraLink mocker to act as if user is typing keyboard via Link.
 *
 */

import { FC, useEffect, useRef, useState } from 'react';
import { keysGeneralLocation, locationKeysDict } from '../../helpers/keyboard';
import Keyboard from '../Keyboard/Keyboard';

interface ILinkMockProps {
  onClickKey(el:string): void;
  isAuto: boolean;
}

const LinkMock: FC<ILinkMockProps> = (props) => {

  const firstLoad = useRef(true);
  const newKey = useRef(['']);
  const receivedText = useRef('');
  const selectedText = useRef("Hello, there.");
  const [ clickedKey, setClickedKey ] = useState('');
  const [ isRefresh, setIsRefresh ] = useState(0);
  const [ currTextState, setCurrTextState ] = useState('');
  const [ isRefresh2, setIsRefresh2 ] = useState(0);
  const [ idx, setIdx ] = useState(0);

  useEffect(() => {
    if (firstLoad.current) {
      activateLinkMock();

      firstLoad.current = false;
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(p=>p+1);
    }, 1000);

    return() => clearInterval(timer);
  }, []);

  function activateLinkMock() {
    selectedText.current?.toLowerCase()?.split('')?.forEach((currSelText, i) => {
      // COMMT: Takes 'h', 'e' etc and returns '2b', '1a' etc.
      const currGenLocation:string = keysGeneralLocation[currSelText];
      // COMMT: Takes '2b', '1a' etc and returns ['f', 'g', 'h'], ['q', 'w', 'e'] etc.
      const currLocationKeys:string[] = Object?.values(locationKeysDict[currGenLocation]);

      // COMMT: Loops through ['f', 'g', 'h'], ['q', 'w', 'e'] etc.
      //  COMMT: and if selected text matches searched text then
      //  COMMT: dispatch it to keyboard for auto typing
      currLocationKeys?.forEach((currText:any) => {
        if (currSelText === currText) {

          new Promise((res, rej) => {
            res(currText);
          })
          .then((res:any) => {
              // if (isRefresh2 >= 10 || idx >= 10) return
              // setClickedKey(res);
              receivedText.current = receivedText.current + res;
              setIsRefresh2(p=>p+1);
              return;
          });
        };
      });

    });

  };


  return (
    <>
      <Keyboard
        isAuto={props.isAuto}
        // clickKey={clickedKey}
        clickKey={receivedText.current?.substring(idx-1, idx)}
        onClickKey={props.onClickKey}
      />
    </>
  )
};

export default LinkMock;
