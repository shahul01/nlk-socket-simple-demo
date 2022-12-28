import { NavLink, useLocation } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import { pageDict } from '../../helpers/pageRoutes';
import { capitalizeFirstLetter } from '../../helpers/misc';
import styles from './Nav.module.scss';

interface INavProps {
}

const Nav: FC<INavProps> = (props) => {
  const { pathname } = useLocation();
  const [ currPage, setCurrPage ] = useState('');

  useEffect(() => {
    updateCurrPage();

  }, [pathname]);

  function updateCurrPage() {
    const newPage = pageDict[pathname];
    if (!newPage) return;
    const newPageCapitalized = capitalizeFirstLetter(newPage);

    setCurrPage(newPageCapitalized);
  };


  return (
    <div className={styles['nav-container']}>
      <div className={styles['content']}>
        <h1 className={styles['curr-page-title']}>
          {currPage}
        </h1>

        <div className={styles['links']}>
          <NavLink
            className={pathname === '/' && (
              styles['curr-page']
            )}
            to='/'
          >
            Home
          </NavLink>
          <NavLink
            className={pathname === '/chat' && (
              styles['curr-page']
            )}
            to='/chat'
          >
            Chat
          </NavLink>

        </div>

      </div>

    </div>
  )
};

export default Nav;
