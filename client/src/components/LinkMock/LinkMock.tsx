/*
 * COMMT:
 * Why: Auto typing.
 * This is a simple NeuraLink mocker to act as if user is typing keyboard via Link.
 *
 */

import { FC, MutableRefObject, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Keyboard from '../Keyboard/Keyboard';
import { setClickedKeyRdx, setKeyAxes } from './LinkMockSlice';
import { keysDict, keysDictReversed, keysGeneralLocation, locationKeysDict } from '../../helpers/keyboard';
import { sampleTexts } from '../../helpers/misc';
import { IKeyAxes } from '../../types/global';
import { RootState } from '../../store/store';

type TCurrKeyObj = {[key:string]:string};
type TNewKBRef = MutableRefObject<{[key:string]:HTMLDivElement|string}>;

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
  const { isAuto, keyAxes, sentLetter, keyClickCount, cursorSpeed } = useSelector((state:RootState) => state.linkMock);
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


  // COMMT:
    // isAuto
    // → receivedTextIdx
    // LinkMock
      // → keyAxes
      // →  currKeyToAdd → receivedText → clickKey

  useEffect(() => {
    receivedText.current = receivedText.current + currKeyToAdd.current;
    const newKey = receivedText.current?.substring(receivedTextIdx-1, receivedTextIdx);

    if (!newKey) return;
    setClickKey({'key': newKey});

  }, [keyAxes, currKeyToAdd.current]);

  function updateNewKBRef(currRef:HTMLDivElement) {
    if (currRef && currRef?.innerText) {
      const currKey:string|null = currRef?.innerText;
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


      currLocationKeys?.forEach( (currKey:string) => {

        if ( currSelTextIdx === keyClickCount && currSelText === currKey ) {
          console.log('1. LM ck : ', currKey);

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
          dispatch(
            setClickedKeyRdx(currKey)
          );

          dispatch(setKeyAxes(newKeyAxes));
          setReceivedTextIdx((p:number)=>p+1);
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
        // clickKey={clickedKey}
        clickKey={clickKey}
        onClickKey={props.onClickKey}
        kbRef={ (currRef:HTMLDivElement) => updateNewKBRef(currRef) }
      />
    </>
  )
};

export default LinkMock;
