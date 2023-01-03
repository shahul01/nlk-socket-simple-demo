import {FC, useState, useEffect} from 'react';
import styles from './Home.module.scss';

const Home:FC = () => {
  return (
    <div className={styles['home-container']}>

      <div className={styles['my-github-link']}>
        Created by
        <a
          href='https://github.com/shahul01'
          target='_blank'
          rel='noreferrer'
        >
          shahul01
        </a>
      </div>

    </div>
  )
};

export default Home;
