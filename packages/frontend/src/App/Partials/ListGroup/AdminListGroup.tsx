import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { ListGroup, ListGroupItem } from 'reactstrap';

import { Navigation } from '../Navbar';
import { encodeLink, GlobalState, Homepage } from '@platonist/library';
import { NavigationType } from '../Navbar/Keys';
import { Link } from 'react-router-dom';

export const AdminListGroupItem: FunctionComponent<Homepage> = (homepage) => {
  const router = useSelector((state: GlobalState) => state.router);
  const baseLink = `/admin/${homepage.url}`;
  return (
    <ListGroupItem>
      <div className="">
        <i className="fa fa-plus mr-3" />
        <Link to={encodeLink(baseLink)}>{homepage.url}</Link>
      </div>
      <div>
        {homepage.pages && (
          <Navigation
            className={'nav-admin'}
            navFor={NavigationType.Admin}
            isHomepage={router.location.pathname === '/'}
            level={1}
            pages={homepage.pages}
            parentLink={baseLink}
            toggled={false}
          />
        )}
      </div>
    </ListGroupItem>
  );
};

export interface AdminListGroupProps {}

export const AdminListGroup: FunctionComponent<AdminListGroupProps> = () => {
  const homepages = useSelector((state: GlobalState) => state.homepages);
  return (
    (homepages.result && (
      <ListGroup>
        {homepages.result.map((homepage, index) => (
          <AdminListGroupItem
            key={`list_group_item_homepages_${homepage.id}_${index}`}
            {...homepage}
          />
        ))}
      </ListGroup>
    )) ||
    null
  );
};
