/*
 * COMMT:
 * Why: Auto typing.
 * This is a simple NeuraLink mocker to act as if user is typing keyboard via Link.
 *
 */

import { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setKeyAxes } from './LinkMockSlice';
import { keysDictReversed, keysGeneralLocation, locationKeysDict } from '../../helpers/keyboard';
import Keyboard from '../Keyboard/Keyboard';
import { IKeyAxes } from '../../types/global';
import { RootState } from '../../store/store';

type TCurrKeyObj = {[key:string]:string};

interface ILinkMockProps {
  onClickKey(arg0:TCurrKeyObj): void;
  isAuto: boolean;
}

const LinkMock: FC<ILinkMockProps> = (props) => {

  const dispatch = useDispatch();
  const firstRender = useRef({
    general: true,
    keyClickCount: true
  });
  const selectedText = useRef("Hello, world.");
  const receivedText = useRef('');
  const isSentAll = useRef(false);
  const currKeyToAdd = useRef('');
  const { keyAxes, sentLetter, keyClickCount } = useSelector((state:RootState) => state.linkMock);
  const [ clickKey, setClickKey ] = useState({});
  const [ receivedTextIdx, setReceivedTextIdx ] = useState(0);
  const [ allKey, setAllKey ] = useState({current:{}});
  const isContinue = useRef(false);

  useEffect(() => {
    if (firstRender.current.keyClickCount) {
      firstRender.current.keyClickCount = false;
    } else {
      // isContinue.current = true;
      activateLinkMock();

    };
  }, [allKey, keyClickCount]);

  useEffect(() => {
    let timerCount = 0;
    const timer: ReturnType<typeof setInterval> = setInterval(() => {
      if (timerCount > selectedText.current?.length) {
        return clearInterval(timer);
      };

      setReceivedTextIdx((p:number)=>p+1);
      timerCount+=1;

    }, 1000);

    return() => clearInterval(timer);
  }, []);

  useEffect(() => {
    const newKey = receivedText.current?.substring(receivedTextIdx-1, receivedTextIdx);

    if (!newKey) return;
    setClickKey({'key': newKey});

  }, [receivedText, receivedTextIdx ]);

  useEffect(() => {
    receivedText.current = receivedText.current + currKeyToAdd.current;

    // keyClickCount
  }, [keyAxes]);

  function activateLinkMock() {
    if (isSentAll.current) return;
    let currKeyPos = 0;
    selectedText.current?.toLowerCase()?.split('')?.forEach((currSelText, currSelTextIdx) => {
      // COMMT: Why: Loops over selectedText letters to match Kb letters and send the pos to Cursor.
      // COMMT: Takes 'h', 'e' etc and returns '2b', '1a' etc.
      const currGenLocation:string = keysGeneralLocation[currSelText];
      // COMMT: Takes '2b', '1a' etc and returns ['f', 'g', 'h'], ['q', 'w', 'e'] etc.
      const currLocationKeys:string[] = Object?.values(locationKeysDict[currGenLocation]);

      // COMMT: Loops through ['f', 'g', 'h'], ['q', 'w', 'e'] etc.
      //  COMMT: and if selected text matches searched text then
      //  COMMT: dispatch it to keyboard for auto typing
      currLocationKeys?.forEach( (currKey:any, currKeyIdx) => {

        if ( currSelTextIdx === keyClickCount && currSelText === currKey ) {


          if (!Object.keys(allKey.current)?.length) return;
          const keysDictRev = keysDictReversed();
          const currKeyCode = keysDictRev[currKey];
          // @ts-expect-error 'any type';
          const keyRect = allKey.current?.[currKeyCode]?.getBoundingClientRect();
          if (!keyRect) return;

          const forceUpdateCount = keyAxes.forceUpdate;
          const newKeyAxes:IKeyAxes = {
            top: keyRect?.top,
            right: keyRect?.right,
            bottom: keyRect?.bottom,
            left: keyRect?.left,
            height: keyRect?.height,
            width: keyRect?.width,
            x: keyRect?.x,
            y: keyRect?.y,
            forceUpdate: forceUpdateCount+1
          };
          dispatch(setKeyAxes(newKeyAxes));
          currKeyToAdd.current = currKey;
          currKeyPos+=1;

          // isContinue.current = false;

        };
        return;

      });
    });

  };


  return (
    <>
      {/* {JSON.stringify(receivedText.current, null, 2)} */}
      <Keyboard
        isAuto={props.isAuto}
        // clickKey={clickedKey}
        clickKey={clickKey}
        onClickKey={props.onClickKey}
        allKeyRef={(val:any) => setAllKey(val)}
      />
    </>
  )
};

export default LinkMock;
