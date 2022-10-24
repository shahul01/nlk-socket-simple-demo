/*
 * COMMT:
 * Why: Auto typing.
 * This is a simple NeuraLink mocker to act as if user is typing keyboard via Link.
 *
 */

import { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setKeyAxes } from './LinkMockSlice';
import { keysGeneralLocation, locationKeysDict } from '../../helpers/keyboard';
import Keyboard from '../Keyboard/Keyboard';
import { IKeyAxes } from '../../types/global';
import { RootState } from '../../store/store';

interface ILinkMockProps {
  onClickKey(el:string): void;
  isAuto: boolean;
}

const LinkMock: FC<ILinkMockProps> = (props) => {

  const dispatch = useDispatch();
  const firstRender = useRef({
    general: true,
    keyClickCount: true
  });
  const selectedText = useRef("hello,there.");
  const receivedText = useRef('');
  const isSentAll = useRef(false);
  // const [ clickedKey, setClickedKey ] = useState('');
  const { keyAxes, sentLetter, keyClickCount } = useSelector((state:RootState) => state.linkMock);
  const [ receivedTextIdx, setReceivedTextIdx ] = useState(0);
  const [ allKey, setAllKey ] = useState({current:{}});
  const isContinue = useRef(false);

  useEffect(() => {
    if (firstRender.current.keyClickCount) {
      firstRender.current.keyClickCount = false;
    } else {
      isContinue.current = true;
      activateLinkMock();

    }
  }, [allKey, keyClickCount]);

  useEffect(() => {
    const timer = setInterval(() => {
      setReceivedTextIdx((p:number)=>p+1);
    }, 1000);

    return() => clearInterval(timer);
  }, []);

  function activateLinkMock() {
    if (isSentAll.current) return;
    let currTextPos = 0;
    selectedText.current?.toLowerCase()?.split('')?.forEach((currSelText, curSelTextIdx) => {
      // COMMT: Takes 'h', 'e' etc and returns '2b', '1a' etc.
      const currGenLocation:string = keysGeneralLocation[currSelText];
      // COMMT: Takes '2b', '1a' etc and returns ['f', 'g', 'h'], ['q', 'w', 'e'] etc.
      const currLocationKeys:string[] = Object?.values(locationKeysDict[currGenLocation]);

      // COMMT: Loops through ['f', 'g', 'h'], ['q', 'w', 'e'] etc.
      //  COMMT: and if selected text matches searched text then
      //  COMMT: dispatch it to keyboard for auto typing
      currLocationKeys?.forEach(async (currText:any, currTextIdx) => {

        if ( curSelTextIdx === keyClickCount && currSelText === currText ) {
          console.log(`#=#=#: `, currText, curSelTextIdx, keyClickCount);
          if (!Object.keys(allKey.current)?.length) return;
          // @ts-expect-error 'any type'
          const keyRect = allKey.current?.[currText]?.getBoundingClientRect();
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
          currTextPos+=1;

          dispatch(setKeyAxes(newKeyAxes));
          // isContinue.current = false;

        };
        return;


      });

    });


  };


  return (
    <>
      <Keyboard
        isAuto={props.isAuto}
        // clickKey={clickedKey}
        clickKey={receivedText.current?.substring(receivedTextIdx-1, receivedTextIdx)}
        onClickKey={props.onClickKey}
        allKeyRef={(val:any) => setAllKey(val)}
      />
    </>
  )
};

export default LinkMock;
