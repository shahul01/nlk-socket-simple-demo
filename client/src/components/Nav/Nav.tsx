import { NavLink, useLocation } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import { pageDict } from '../../helpers/pageRoutes';
import styles from './Nav.module.scss';

interface INavProps {
}

const Nav: FC<INavProps> = (props) => {


  const location = useLocation();
  const [ currPage, setCurrPage ] = useState('');
  const [ isCurrPage, setIsCurrPage ] = useState({});

  useEffect(() => {
    updateCurrPage();

  }, [location]);

  function updateCurrPage() {
    const newPage = pageDict[location?.pathname];
    if (!newPage && typeof(newPage) !== 'string') return;
    const newPageCapitalized = newPage?.charAt(0)?.toUpperCase() + newPage.slice(1, newPage.length);
    console.log(`location: `, location, newPage, newPageCapitalized.toLowerCase());

    setCurrPage(newPageCapitalized);
  };

  return (
    <div className={styles['nav-container']}>
      <div className={styles['content']}>
        <h1 className='text-3xl font-bold'>
          {currPage}
        </h1>

        <div className={styles['links']}>
          <NavLink
            className={location.pathname === '/' && (
              styles['curr-page']
            )}
            to='/'
          >
            Home
          </NavLink>
          <NavLink
            className={location.pathname === '/chat' && (
              styles['curr-page']
            )}
            to='/chat'
          >
            Chat
          </NavLink>

        </div>

      </div>
      <br /><hr /><br />

    </div>
  )
};

export default Nav;
