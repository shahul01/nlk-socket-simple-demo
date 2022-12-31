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
import { RootState } from '../../store/store';
import { IKeyAxes } from '../../types/global';

type TNewKBRef = MutableRefObject<{[key:string]:HTMLDivElement|string}>;

const LinkMock: FC = (props) => {

  const dispatch = useDispatch();
  const firstRender = useRef({
    general: true,
    keyClickCount: true
  });
  const selectedText = useRef(sampleTexts['matrixKungFu']);
  const isSentAll = useRef(false);
  const newKBRef:TNewKBRef = useRef({...keysDict});
  const { isAuto, keyAxes, keyClickCount } = useSelector((state:RootState) => state.linkMock);
  // const [ allKey, setAllKey ] = useState({current:{}});

  useEffect(() => {
    // if (firstRender.current.keyClickCount) {
    //   firstRender.current.keyClickCount = false;
    // } else {
      // isContinue.current = true;
      activateLinkMock();

    // };
  }, [isAuto, newKBRef, keyClickCount]);


  function updateNewKBRef(currRef:HTMLDivElement) {
    if (currRef && currRef?.innerText) {
      const currKey:string|null = currRef?.innerText;
      if (!currKey) return;
      newKBRef.current[currKey] = currRef;
      // updateAllKey();
    };
  };

  function activateLinkMock() {
    if (!isAuto || isSentAll.current) return;
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

      let breakPointInnerLoop = false;
      currLocationKeys?.forEach( (currKey:string) => {

        if ( currSelTextIdx === keyClickCount && currSelText === currKey ) {
          // console.log('1. LM currKey : ', currKey);

          if (!Object.keys(newKBRef.current)?.length) return;
          const currKeyCode = keysDictReversed[currKey];
          const currKeyDiv = newKBRef.current?.[currKeyCode];
          if (typeof(currKeyDiv) !== 'object') return;
          const keyRect = currKeyDiv?.getBoundingClientRect();
          if (!keyRect) return;
          breakPointInnerLoop = true;

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
          dispatch(setClickedKeyRdx({ key:currKey }));

          return;
        };

        if (breakPointInnerLoop) return;

      });
    });

  };

  return (
    <>
      <Keyboard
        // clickKey={clickedKey}
        kbRef={ (currRef:HTMLDivElement) => updateNewKBRef(currRef) }
      />
    </>
  )
};

export default LinkMock;
