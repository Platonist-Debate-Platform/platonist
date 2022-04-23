import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Collapse, Navbar } from 'reactstrap';

import {
  GlobalState,
  Homepage,
  Page,
  PublicRequestKeys,
  User,
} from '@platonist/library';
import { NavigationType } from './Keys';
import Logo from './NavbarBrand';
import Header from './NavbarHeader';
import { Navigation } from './Navigation';
import { NavigationMobile } from './NavigationMobile';

export interface NavbarComponentProps {
  [PublicRequestKeys.Router]: GlobalState[PublicRequestKeys.Router];
  homePageData?: Homepage;
  pages?: Page[];
  user?: User;
}

export const NavbarComponentBase: React.FC<NavbarComponentProps> = ({
  pages,
  router,
  homePageData,
}) => {
  const [location, setLocation] = useState(router.location);
  const [toggled, setToggle] = useState<boolean>(false);
  const [screenSize, setScreenSize] = useState<{
    height: number;
    width: number;
  }>({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const homepage = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Homepage]
  >((state) => state[PublicRequestKeys.Homepage]);
  const isHomepage = location.pathname === '/';
  const isNotFound = location.pathname === '/404';

  const handleResize = (size: { height: number; width: number }) => {
    setScreenSize(size);
  };

  const handleToggle = (state: boolean) => {
    if (toggled !== state) {
      setToggle(state);
    }
  };

  const isTabletScreen = screenSize.width <= 991;
  const isMobileScreen = screenSize.width <= 767;

  useEffect(() => {
    if (router.location.key !== location.key) {
      setLocation(router.location);
    }
  }, [location, router.location, setLocation]);

  return (
    <Header
      id="header_main"
      isHomepage={isHomepage || isNotFound}
      onResize={handleResize}
    >
      <Navbar
        className={classNames('fixed-top', {
          'navbar-home': isHomepage || isNotFound,
          'navbar-regular': !(isHomepage || isNotFound),
        })}
        id={`navbar_main`}
        light={!(isHomepage || isNotFound)}
        expand="md"
      >
        {homepage.result && homepage.result.logo ? (
          <Logo
            {...homepage.result.logo}
            title={homepage.result.title || 'Platonist Application'}
            isHomepage={isHomepage || isNotFound || true}
          />
        ) : (
          <Link className="navbar-brand" to="/">
            {homepage.result?.title || 'Platonist Application'}
          </Link>
        )}
        {!isTabletScreen && (
          <Collapse isOpen={false} navbar>
            {pages && pages.length > 0 && (
              <Navigation
                className={'ml-auto'}
                isHomepage={isHomepage || isNotFound}
                level={1}
                navFor={NavigationType.Navbar}
                pages={pages}
                toggled={toggled}
                tools={homepage.result && homepage.result.tools}
                homepageMenu={homePageData && homePageData.menuTitle}
              />
            )}
          </Collapse>
        )}
        {isTabletScreen && (
          <NavigationMobile
            screenSize={screenSize}
            isMobileScreen={isMobileScreen}
            toggle={handleToggle}
          >
            <>
              {pages && pages.length > 0 && (
                <Navigation
                  className={'ml-auto'}
                  isHomepage={isHomepage || isNotFound}
                  isSandwich={isTabletScreen}
                  level={1}
                  navFor={NavigationType.Navbar}
                  pages={pages}
                  toggled={toggled}
                  tools={homepage.result && homepage.result.tools}
                  homepageMenu={homePageData && homePageData.menuTitle}
                />
              )}
            </>
          </NavigationMobile>
        )}
      </Navbar>
    </Header>
  );
};

export const NavbarComponent = connect((state: GlobalState) => ({
  [PublicRequestKeys.Router]: state[PublicRequestKeys.Router],
}))(NavbarComponentBase);

export default NavbarComponent;
