import classes from './Navbar.module.scss';
import logoutIcon from '../../../assets/icons/exit.svg';
import changePaswordIcon from '../../../assets/icons/change-pass.svg';

import profileIcon from '../../../assets/icons/profile.svg';
import arrowDownIcon from '../../../assets/images/icons/arrow-down-menu.svg';
import arrowUpIcon from '../../../assets/images/icons/arrow-up-menu.svg';
import { NavLink } from 'react-router-dom';
import Modal from '../../modals/modal';
import authContext from '../../../context/auth/authContext';
import { useContext, useState } from 'react';
import ChangePasswordModal from '../../modals/change-password-modal/ChangePasswordModal';
import hamburgerIcon from '../../../assets/images/icons/hamburger-icon.svg';
import carIcon from '../../../assets/icons/car-icon.svg';
import homeIcon from '../../../assets/icons/home.svg';

import orderIcon from '../../../assets/icons/orders.svg';
// import toggleMenuIcon from '../../../assets/icons/toggle-menu.svg';

import agencyIcon from '../../../assets/icons/agencies.svg';
import announcementIcon from '../../../assets/icons/announcements.svg';

import headerLogo from '../../../assets/logo.png';

const Navbar = () => {
  const { logoutUser, isUserLogin, userProfileData } = useContext(authContext);

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNavItem, setShowNavItem] = useState(false);
  const [isChangePassModalVisible, setIsChangePassModalVisible] =
    useState(false);

  return (
    <header className={classes.headerWrapper}>
      <div className='container'>
        {isChangePassModalVisible && (
          <Modal
            setIsModalVisible={setIsChangePassModalVisible}
            title='تغییر رمز عبور'
            widthInnerModal='700px'
          >
            <ChangePasswordModal
              setIsModalVisible={setIsChangePassModalVisible}
            />
          </Modal>
        )}

        {showMobileMenu && (
          <div className={classes.mobileMenu}>
            <div
              className={classes.shadow}
              onClick={() => setShowMobileMenu(false)}
            ></div>
            <div className={classes.mobileMenuItems}>
              <ul>
                <li>
                  <NavLink to='/'>
                    <img src={homeIcon} alt='' />
                    <span>خانه</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/products'>
                    <img src={carIcon} alt='' />
                    <span>محصولات </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/announcement'>
                    <img src={announcementIcon} alt='' />
                    <span>اطلاعیه های فروش</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/agencies'>
                    <img src={agencyIcon} alt='' />
                    <span>نمایندگی های فروش</span>
                  </NavLink>
                </li>

                {isUserLogin && (
                  <>
                    <li>
                      <NavLink to='/profile'>
                        <img src={profileIcon} alt='' />
                        <span>پروفایل</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to='/orders'>
                        <img src={orderIcon} alt='' />
                        <span>سفارشات</span>
                      </NavLink>
                    </li>
                    <li
                      className={classes.passChange}
                      onClick={() => {
                        setIsChangePassModalVisible(true);
                        setShowMobileMenu(false);
                      }}
                    >
                      <img src={changePaswordIcon} alt='' />
                      <span>تغییر رمز عبور</span>
                    </li>
                    <li
                      onClick={() => {
                        logoutUser();
                      }}
                      className={classes.signOut}
                    >
                      <img src={logoutIcon} alt='' />
                      <span>خروج</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}

        <div className={classes.navWrapper}>
          <div className={classes.menusWrapper}>
            <div className={classes.menu}>
              <ul>
                <li className={classes.home}>
                  <NavLink to='/'>
                    <img src={headerLogo} alt='' />
                  </NavLink>
                </li>
                <li className={classes.productsLink}>
                  <NavLink to='/products'>محصولات</NavLink>
                </li>
                <li>
                  <NavLink to='/announcement'>اطلاعیه های فروش</NavLink>
                </li>

                <li className={classes.agencilesLink}>
                  <NavLink to='/agencies'>نمایندگی های فروش</NavLink>
                </li>
              </ul>
            </div>
            <div
              className={classes.hamburgerWrapper}
              onClick={() => {
                setShowMobileMenu(!showMobileMenu);
              }}
            >
              <img src={hamburgerIcon} alt='' />
            </div>

            <div className={classes.auth}>
              {isUserLogin ? (
                <ul className={classes.afterLoginDesktop}>
                  <li
                    onClick={() => {
                      setShowNavItem(!showNavItem);
                    }}
                  >
                    {userProfileData?.name ? (
                      <span>
                        <img src={profileIcon} alt='profile icon' />
                        {userProfileData?.name} {userProfileData?.surname}
                      </span>
                    ) : (
                      <span>
                        <img src={profileIcon} alt='profile icon' />
                        حساب کاربری
                      </span>
                    )}

                    <img
                      className={classes.arrowDown}
                      src={showNavItem ? arrowUpIcon : arrowDownIcon}
                      alt='arrow up or down icon'
                    />
                    {showNavItem && (
                      <ul
                        className={classes.afterLoginMenu}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <li>
                          <NavLink to='/profile'>
                            <img src={profileIcon} alt='' />
                            <span>پروفایل</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink to='/orders'>
                            <img src={orderIcon} alt='' />
                            <span>سفارشات</span>
                          </NavLink>
                        </li>
                        <li
                          onClick={() => {
                            setIsChangePassModalVisible(true);
                          }}
                        >
                          <img src={changePaswordIcon} alt='' />
                          <span> تغییر رمز عبور</span>
                        </li>

                        <li
                          onClick={() => {
                            logoutUser();
                          }}
                        >
                          <img src={logoutIcon} alt='logout icon' />
                          <span>خروج از حساب کاربری</span>
                        </li>
                        {/* <div
                          className={classes.closeDropDown}
                          onClick={() => setShowNavItem(false)}
                        >
                          <img src={toggleMenuIcon} alt='' />
                        </div> */}
                      </ul>
                    )}
                  </li>
                </ul>
              ) : (
                <ul className={classes.beforeLogin}>
                  <li>
                    <NavLink to='/login'>
                      <img src={profileIcon} alt='profile icon' />
                      <span>ورود </span>{' '}
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to='/authentication'>
                      <span>ثبت نام</span>
                    </NavLink>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
