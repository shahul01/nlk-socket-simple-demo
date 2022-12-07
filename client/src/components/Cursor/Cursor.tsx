import { FC, MutableRefObject, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
// import {  } from '../LinkMock/LinkMockSlice';
import { incrementKeyClickCount } from '../LinkMock/LinkMockSlice';
import { ICursorPos } from '../../types/global';
import styles from './Cursor.module.scss';

interface ICursorProps {
}

const Cursor: FC<ICursorProps> = (props) => {
  const dispatch = useDispatch();
  const initialCursorState:ICursorPos = { top: 0, left: 0 };
  const timer:MutableRefObject<NodeJS.Timer|null> = useRef(null);
  const isMoveCursor = useRef(true);
  // const pointRef = useSelector((state:RootState) => state.point?.pointRef);
  const { isAuto, keyAxes, cursorSpeed } = useSelector((state:RootState) => state.linkMock);
  const [ cursorPos, setCursorPos ] = useState(initialCursorState);

  useEffect(() => {
    cursorMove();

    return () => clearInterval(timer.current as NodeJS.Timeout)
  }, [isMoveCursor, keyAxes]);

  useEffect(() => {
    cursorMoveOrPause();

  }, [keyAxes]);

  useEffect(() => {
    // console.log(`keyAxes Cursor: `,  keyAxes.y, keyAxes.x);

  }, [keyAxes]);


  function cursorMove() {
    // const cursorSpeed = 400; // COMMT: less num increases speed.
    // const cursorStep = 20; // COMMT: max 20 as step should be less than btn width
    const posAdjustment = {top: (16/2), left: 7}; // 1.2 * 16
    // const passivelyScroll = (prev:ICursorPos) => prev.left+cursorStep;
    const goDirectlyToClickableBtn = keyAxes?.x;

    timer.current = setInterval(() => {
      if (!isMoveCursor.current || !(keyAxes?.top + keyAxes?.left) ) return clearInterval(timer.current as NodeJS.Timer);

      setCursorPos(prev => ({
        top: keyAxes?.y + posAdjustment.top,
        // left: passivelyScroll(prev),
        left: goDirectlyToClickableBtn + posAdjustment.left,
      }));

      if (!isAuto) return;
      dispatch(
        incrementKeyClickCount()
      );
      isMoveCursor.current = false;

    }, cursorSpeed);

  };

  function cursorMoveOrPause() {

    if (!keyAxes?.x) return;
    const differenceX = cursorPos.left - keyAxes?.x;

    // || (
    //   differenceX >= 0
    //   && differenceX <= 2
    // )
    if (
      (
        cursorPos.left === keyAxes?.x
        && cursorPos.top === keyAxes?.y
      )
    ) {
      isMoveCursor.current = false;

    } else if (
      cursorPos.left !== keyAxes?.x
      || cursorPos.top !==keyAxes?.y
    ) {
      isMoveCursor.current = true;

    };

  };


  return (
    <div
      className={styles['cursor']}
      style={{display: `${isAuto ? 'block' : 'none'}`, top:`${cursorPos.top}px`, left:`${cursorPos.left}px`}}
    >
    </div>
  )
};

export default Cursor;
