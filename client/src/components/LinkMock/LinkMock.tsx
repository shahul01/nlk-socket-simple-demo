/*
 * COMMT:
 * Why: Auto typing.
 * This is a simple NeuraLink mocker to act as if user is typing keyboard via Link.
 *
 */

import { FC, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Keyboard from '../Keyboard/Keyboard';
import { setKeyAxes } from './LinkMockSlice';
import { keysDict, keysDictReversed, keysGeneralLocation, locationKeysDict } from '../../helpers/keyboard';
import { sampleTexts } from '../../helpers/misc';
import { IKeyAxes } from '../../types/global';
import { RootState } from '../../store/store';

type TCurrKeyObj = {[key:string]:string};
type TNewKBRef = MutableRefObject<{[key:string]:HTMLDivElement|string}>;
// type TAllKeyRef = MutableRefObject<{[currKey:string]:HTMLDivElement|string|null}>;

interface ILinkMockProps {
  onClickKey(arg0:TCurrKeyObj): void;
}

const LinkMock: FC<ILinkMockProps> = (props) => {

  const dispatch = useDispatch();
  const firstRender = useRef({
    general: true,
    keyClickCount: true
  });
  const selectedText = useRef(sampleTexts['matrixKungFu']);
  const receivedText = useRef('');
  const isSentAll = useRef(false);
  const currKeyToAdd = useRef('');
  const newKBRef:TNewKBRef = useRef({...keysDict});
  // const isContinue = useRef(false);
  const { keyAxes, sentLetter, keyClickCount, isAuto } = useSelector((state:RootState) => state.linkMock);
  const [ clickKey, setClickKey ] = useState({});
  const [ receivedTextIdx, setReceivedTextIdx ] = useState(0);
  // const [ allKey, setAllKey ] = useState({current:{}});

  useEffect(() => {
    if (firstRender.current.keyClickCount) {
      firstRender.current.keyClickCount = false;
    } else {
      // isContinue.current = true;
      activateLinkMock();

    };
  }, [isAuto, newKBRef, keyClickCount]);

  useEffect(() => {
    let timerCount = 0;
    const timer: ReturnType<typeof setInterval> = setInterval(() => {
      if (!isAuto || timerCount > selectedText.current?.length) {
        return clearInterval(timer);
      };

      setReceivedTextIdx((p:number)=>p+1);
      timerCount+=1;

    }, 400);

    return() => clearInterval(timer);
  }, [isAuto]);

  useEffect(() => {
    receivedText.current = receivedText.current + currKeyToAdd.current;

    // keyClickCount
  }, [keyAxes, currKeyToAdd.current]);

  useEffect(() => {
    const newKey = receivedText.current?.substring(receivedTextIdx-1, receivedTextIdx);

    if (!newKey) return;
    setClickKey({'key': newKey});

  }, [receivedTextIdx]);

  function updateNewKBRef(currRef:HTMLDivElement) {
    if (currRef && currRef?.textContent) {
      const currKey:string|null = currRef?.textContent;
      newKBRef.current[currKey] = currRef;
      // updateAllKey();
    };
  };

  // function updateAllKey() {
  //   setAllKey(newKBRef);
  // };

  function activateLinkMock() {
    if (!isAuto || isSentAll.current) return;
    let currKeyPos = 0;
    selectedText.current?.toLowerCase()?.split('')?.forEach((currSelText, currSelTextIdx) => {
      // COMMT: Why: Loops over selectedText letters to match KB letters and send the pos to Cursor.
      // COMMT: Takes 'h', 'e' etc and returns '2b', '1a' etc.
      const currGenLocation:string = keysGeneralLocation[currSelText];
      // COMMT: Takes '2b', '1a' etc and returns ['f', 'g', 'h'], ['q', 'w', 'e'] etc.
      if (!currGenLocation) return;
      const currLocationKeys:string[] = Object?.values(locationKeysDict[currGenLocation]);

      // COMMT: Loops through ['f', 'g', 'h'], ['q', 'w', 'e'] etc.
      //  COMMT: and if selected text matches searched text then
      //  COMMT: dispatch it to keyboard for auto typing


      currLocationKeys?.forEach( (currKey:string, currKeyIdx) => {

        if ( currSelTextIdx === keyClickCount && currSelText === currKey ) {

          if (!Object.keys(newKBRef.current)?.length) return;
          const keysDictRev = keysDictReversed();
          const currKeyCode = keysDictRev[currKey];
          const currKeyDiv = newKBRef.current?.[currKeyCode];
          if (typeof(currKeyDiv) !== 'object') return;
          const keyRect = currKeyDiv?.getBoundingClientRect();
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
      {/* {'kbRef - ' + JSON.stringify(newKBRef.current, null, 2)} */}
      <Keyboard
        // clickKey={clickedKey}
        kbRef={ (currRef:HTMLDivElement) => updateNewKBRef(currRef) }
        clickKey={clickKey}
        onClickKey={props.onClickKey}
        allKeyRef={() => {''}}
      />
    </>
  )
};

export default LinkMock;
