import classNames from 'classnames';
import React, { MouseEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import {
  encodeLink,
  GlobalState,
  Page,
  PublicRequestKeys,
} from '@platonist/library';
import { NavigationType } from './Keys';
import { enableNavItem } from './Utils';

export interface NavigationItemProps extends Page {
  index: number;
  isSandwich: boolean;
  level: number;
  navFor: NavigationType;
  parentLink?: string;
  toggled: boolean;
}

interface NavigationContentItemProps {
  item: Page;
  parentLink?: string;
  title: string;
  location: GlobalState['router']['location'];
}

export const NavigationContentItem: React.FC<NavigationContentItemProps> = ({
  item,
  location,
  parentLink,
  title,
}) => {
  const linkTo = parentLink
    ? parentLink + `/${item.title}`
    : `/${title}/${item.title}`;
  const isActive =
    location.pathname === linkTo || location.pathname.startsWith(linkTo);

  return (
    <NavItem active={isActive}>
      <Link className="nav-link" to={encodeLink(linkTo)}>
        {item.title}
      </Link>
    </NavItem>
  );
};

export const NavigationItem: React.FC<NavigationItemProps> = (props) => {
  const {
    active,
    inFooter,
    inNavigation,
    isSandwich,
    level,
    name,
    navFor,
    pages,
    parentLink,
    title,
    toggled,
  } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state[PublicRequestKeys.Router]);
  const enabled = enableNavItem(navFor, inNavigation, inFooter);

  const items = pages || [];
  const linkTo = (parentLink || '') + `/${title}`;
  const isActive =
    location.pathname === linkTo || location.pathname.startsWith(linkTo);
  const hasNoItems = !items || (items && items.length === 0);

  const handleMouseMove = (event: MouseEvent<HTMLLIElement>) => {
    if (isSandwich) {
      return;
    }

    if (navFor !== NavigationType.Navbar || level !== 1) {
      return;
    }

    if (hasNoItems) {
      return;
    }

    const headerElement = document.getElementById(
      'navbar_main',
    ) as HTMLDivElement | null;
    const headerBg = headerElement?.parentElement?.querySelector(
      '.header-sub-bg',
    ) as HTMLDivElement | null;
    const currentTarget = event.currentTarget as HTMLLIElement;
    const subList =
      currentTarget.childNodes &&
      (currentTarget.childNodes.item(1) as HTMLUListElement | null);
    const headerHeight = headerElement?.clientHeight || 0;
    const subListHeight = subList?.clientHeight || 0;
    const itemHeight = headerHeight + subListHeight;

    if (headerBg && event.type === 'mouseenter') {
      headerBg.classList.add('hovered');
      headerBg.style.height = itemHeight + 'px';
    }
    if (headerBg && event.type === 'mouseleave') {
      headerBg.classList.remove('hovered');
      headerBg.style.height = '';
    }
  };

  const handleClick = (
    event: MouseEvent<HTMLAnchorElement>,
    backLink: boolean,
  ) => {
    if (!isSandwich || hasNoItems) {
      return;
    }

    if (navFor === NavigationType.Navbar) {
      event.preventDefault();
      if (!isOpen && !backLink) {
        setIsOpen(true);
      }
      if (isOpen && backLink) {
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    if (!toggled && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen, setIsOpen, toggled]);

  if (!active || !enabled) {
    return null;
  }

  return (
    <NavItem
      active={isActive}
      onMouseEnter={handleMouseMove}
      onMouseLeave={handleMouseMove}
    >
      <Link
        className="nav-link"
        to={encodeLink(linkTo)}
        title={title}
        onClick={(event) => handleClick(event, false)}
      >
        {name || title}{' '}
        {isSandwich && navFor === NavigationType.Navbar && items && (
          <i className="icon icon-arrow-right" />
        )}
      </Link>
      <Nav
        className={classNames('nav-sub', {
          show: isOpen,
        })}
        navbar={false}
        vertical={true}
      >
        {isSandwich && navFor === NavigationType.Navbar && (
          <>
            <NavItem className="nav-item-title">
              <Link
                className="nav-link"
                to={encodeLink(linkTo)}
                title={title}
                onClick={(event) => handleClick(event, true)}
              >
                <i className="icon icon-arrow-left" /> {name || title}
              </Link>
            </NavItem>
            <NavItem>
              <Link className="nav-link" to={encodeLink(linkTo)} title={title}>
                {name || title} Übersicht
              </Link>
            </NavItem>
          </>
        )}
        {items &&
          items.map(
            (item, index) =>
              item && (
                <NavigationContentItem
                  key={`nav_footer_item_${item.id}_${index}`}
                  location={location}
                  item={item}
                  parentLink={linkTo}
                  title={title}
                />
              ),
          )}
      </Nav>
    </NavItem>
  );
};
