import classNames from 'classnames';
import { stringify } from 'qs';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Col, Collapse, Row } from 'reactstrap';

import { Debate, GlobalState, PublicRequestKeys } from '@platonist/library';
import { useAuthentication } from '../../Hooks';
import { AuthenticationButton } from '../Authentication';
import { CommentForm } from './CommentForm';
import { DismissButton } from './DismissButton';
import { GERMAN } from '../../i18n';

export interface CommentAddProps {
  debateId: Debate['id'];
}

export const CommentAdd: FunctionComponent<CommentAddProps> = ({
  debateId,
}) => {
  const [isAuthenticated] = useAuthentication();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state[PublicRequestKeys.Router]);

  const searchQuery =
    '?' +
    stringify({
      edit: 'comment',
      id: 'new',
    });

  const toggle = useCallback(
    (
      shouldToggle: boolean | React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      if (shouldToggle && !shouldRedirect) {
        setShouldRedirect(true);
      }
    },
    [shouldRedirect],
  );

  useEffect(() => {
    if (shouldRedirect && location.search.length === 0) {
      setShouldRedirect(false);
    }
  }, [location.search.length, shouldRedirect]);

  return (
    <Row>
      <Col md={12}>
        <Collapse isOpen={location.search === searchQuery}>
          <DismissButton
            isBtn={false}
            pathname={location.pathname}
            title="Cancel"
          />
          {isAuthenticated && (
            <CommentForm
              debateId={debateId}
              onSuccess={toggle}
              reset={location.search !== searchQuery}
              dismissElement={
                <DismissButton
                  className="mr-3"
                  isBtn={true}
                  pathname={location.pathname}
                  title="Cancel"
                />
              }
            />
          )}
        </Collapse>
      </Col>
      <Col
        ms={12}
        className={classNames('text-right', {
          'd-none': location.search === searchQuery,
        })}
      >
        <AuthenticationButton
          component={
            <>
              {GERMAN.comments.participate} <i className="fa fa-comment" />
            </>
          }
          onClick={toggle}
          pathToAction={location.pathname + searchQuery}
        />
      </Col>
      {shouldRedirect && <Redirect to={location.pathname} />}
    </Row>
  );
};
