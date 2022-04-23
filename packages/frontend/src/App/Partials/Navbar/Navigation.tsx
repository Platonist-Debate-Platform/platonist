import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';

import { Page, SocialItem } from '@platonist/library';
import { NavigationType } from './Keys';
import { NavigationItem } from './NavigationItem';
import { NavigationPrivate } from './NavigationPrivate';

export interface NavigationProps {
  className?: string;
  navFor: NavigationType;
  isHomepage?: boolean;
  isSandwich?: boolean;
  level: number;
  pages: (Page | null)[] | null;
  parentLink?: string;
  tools?: SocialItem | null;
  toggled: boolean;
  homepageMenu?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  className,
  isHomepage,
  isSandwich,
  level,
  navFor,
  pages,
  parentLink,
  tools,
  toggled,
  homepageMenu,
}) => {
  if (pages && !pages.length) {
    return null;
  }

  return (
    <Nav className={className} navbar={navFor === NavigationType.Navbar}>
      {level === 1 && navFor === NavigationType.Navbar && (
        <NavItem className="nav-item-title" active={isHomepage}>
          <Link className="nav-link" to={'/'} title={homepageMenu}>
            {homepageMenu}
          </Link>
        </NavItem>
      )}
      {pages &&
        pages.map(
          (page, index) =>
            (page && (
              <React.Fragment
                key={`page_navigation_${level}_${page.id}_${index}`}
              >
                <NavigationItem
                  {...page}
                  index={index}
                  isSandwich={isSandwich ? true : false}
                  level={level}
                  navFor={navFor}
                  parentLink={parentLink}
                  toggled={toggled}
                />
              </React.Fragment>
            )) ||
            null,
        )}
      {level === 1 && navFor === NavigationType.Footer && tools && (
        <NavItem>
          <span className="nav-link">{tools.title}</span>
          {tools.socials && (
            <Nav className="nav-sub nav-social">
              {tools.socials.map(
                (social, index) =>
                  (social && (
                    <NavItem key={`nav_item_social_${social.id}_${index}`}>
                      <a
                        className="nav-link"
                        href={social.link}
                        target="_blank"
                        title={social.title}
                        rel="noopener noreferrer"
                      >
                        <i className={`icon-${social.icon}`} />
                        <span className="sr-only">{social.title}</span>
                      </a>
                    </NavItem>
                  )) ||
                  null,
              )}
            </Nav>
          )}
        </NavItem>
      )}
      {level === 1 && <NavigationPrivate />}
    </Nav>
  );
};
