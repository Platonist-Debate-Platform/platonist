import React, { ReactNode, useState, useEffect } from 'react';
import { slide as MobileMenu, State } from 'react-burger-menu';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { GlobalState, PublicRequestKeys } from '@platonist/library';

export interface NavigationMobileProps {
  [PublicRequestKeys.Router]: GlobalState[PublicRequestKeys.Router];
  children: ReactNode;
  isMobileScreen: boolean;
  screenSize: { height: number; width: number };
  toggle: (state: boolean) => void;
}

export const NavigationMobileBase: React.FC<NavigationMobileProps> = ({
  children,
  isMobileScreen,
  router,
  screenSize,
  toggle,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [location, setLocation] = useState(router.location);

  const handleStateChange = (state: State) => {
    const navbar = document.getElementById(
      'navbar_main',
    ) as HTMLDivElement | null;
    const navbarBrand = navbar?.querySelector(
      '.navbar-brand',
    ) as HTMLAnchorElement | null;

    if (state.isOpen && navbarBrand) {
      navbarBrand.classList.add('nav-toggled');
    }

    if (!state.isOpen && navbarBrand) {
      navbarBrand.classList.remove('nav-toggled');
    }

    if (state.isOpen !== isOpen) {
      setIsOpen(state.isOpen);
    }

    toggle(state.isOpen);
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (location.pathname !== router.location.pathname) {
      if (isOpen) {
        setIsOpen(false);
      }
      setLocation(router.location);
    }
  }, [location.pathname, isOpen, router.location]);

  return (
    <>
      <div className="navbar-sandwich">
        <button
          className={classNames('navbar-sandwich-toggle', {
            active: isOpen,
          })}
          onClick={handleClick}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <MobileMenu
        disableAutoFocus={false}
        disableCloseOnEsc={false}
        id="slide"
        isOpen={isOpen}
        noOverlay={false}
        noTransition={false}
        outerContainerId="page"
        pageWrapId="main_body"
        right={true}
        width={
          isMobileScreen ? '100%' : ((screenSize.width * (100 / 3)) / 100) * 2
        }
        onStateChange={handleStateChange}
      >
        {children}
      </MobileMenu>
    </>
  );
};

export const NavigationMobile = connect((state: GlobalState) => ({
  [PublicRequestKeys.Router]: state[PublicRequestKeys.Router],
}))(NavigationMobileBase);
