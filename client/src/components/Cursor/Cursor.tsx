import { FC, useEffect, useState } from 'react';
import styles from './Cursor.module.scss';

interface ICursorProps {
}

const Cursor: FC<ICursorProps> = (props) => {

  return (
    <div className={styles['cursor']}>

    </div>
  )
};

export default Cursor;
