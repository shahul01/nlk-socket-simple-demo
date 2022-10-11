import { FC, MutableRefObject, useEffect, useRef, useState } from 'react';
import { RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
// import { triggerPointClicks } from '';
import styles from './Cursor.module.scss';

interface ICursorPos {
  top: number;
  left: number;
}

interface ICursorProps {
}

const Cursor: FC<ICursorProps> = (props) => {
  const dispatch = useDispatch();
  const initialCursorState:ICursorPos = { top: 0, left: 0 };
  const timer:MutableRefObject<NodeJS.Timer|null> = useRef(null);
  const isMoveCursor = useRef(true);
  // const pointRef = useSelector((state:RootState) => state.point?.pointRef);
  const pointRef = {boundingClientRect: {x:0,y:0}};
  const [ cursorPos, setCursorPos ] = useState(initialCursorState);

  useEffect(() => {
    cursorMove();
    return () => clearInterval(timer.current as NodeJS.Timeout);
  }, [isMoveCursor, pointRef]);

  useEffect(() => {
    cursorMoveOrPause();
  }, [cursorPos, pointRef]);

  function cursorMove() {
    // const cursorStep = 20; // COMMT: max 20 as step should be less than btn width
    const cursorSpeed = 1000;
    const posAdjustment = 16/2; // 1.2 * 16
    const refAxes = pointRef?.boundingClientRect;
    // const passivelyScroll = (prev:ICursorPos) => prev.left+cursorStep;
    const goDirectlyToClickableBtn = refAxes?.x;

    timer.current = setInterval(() => {
      if (!isMoveCursor.current) return;

      setCursorPos(prev => ({
        top: refAxes?.y+posAdjustment,
        // left: passivelyScroll(prev),
        left: goDirectlyToClickableBtn,
      }));


    }, cursorSpeed);
  };

  function cursorMoveOrPause() {

    const refAxes = pointRef?.boundingClientRect;
    if (!refAxes?.x) return;
    const differenceX = cursorPos.left - refAxes?.x;

    if (
      (
        cursorPos.left === refAxes?.x
        && cursorPos.top === refAxes?.y
      )||(
        differenceX >= 0
        && differenceX <= 2
      )
    ) {

      isMoveCursor.current = false;

      // dispatch(
      //   triggerPointClicks()
      // );

    } else if (
      cursorPos.left <  refAxes?.x
      || cursorPos.top < refAxes?.y
    ) {
      isMoveCursor.current = true;
    };

  };

  return (
    <div
      className={styles['cursor']}
      style={{top:`${cursorPos.top}px`, left:`${cursorPos.left}px`}}
    >
    </div>
  )
};

export default Cursor;
