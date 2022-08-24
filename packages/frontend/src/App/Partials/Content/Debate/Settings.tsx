import {
  ApplicationKeys,
  Debate,
  encodeLink,
  GlobalState,
  PublicRequestKeys,
  RestMethodKeys,
} from '@platonist/library';
import { stringify } from 'querystring';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

import { DebatePermission } from './Permission';

export interface DebateSettingsProps {
  debateId?: Debate['id'];
  method: RestMethodKeys;
}

export const createSettingsQuery = ({
  method,
  debateId,
}: DebateSettingsProps) => {
  const query = {
    modal: ApplicationKeys.Debate,
    method,
  };

  if (debateId && method !== RestMethodKeys.Create) {
    Object.assign(query, {
      id: debateId,
    });
  }

  return query;
};

export const DebateSettings: FunctionComponent<DebateSettingsProps> = ({
  debateId,
  method,
}) => {
  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state.router);

  const query = createSettingsQuery({
    debateId,
    method,
  });

  const searchQuery = stringify(query);
  const linkTo = `${encodeLink(location.pathname)}?${searchQuery}`;

  return (
    <DebatePermission method={method}>
      <>
        {method === RestMethodKeys.Create && (
          <div className="debate-settings debate-settings-create py-3">
            <Container fluid={true}>
              <Row>
                <Col className="text-right">
                  <Link
                    to={linkTo}
                    className="btn btn-primary btn-sm"
                    title="Create a new debate"
                  >
                    <i className="fa fa-plus" /> Füge neue Debatte hinzu
                  </Link>
                </Col>
              </Row>
            </Container>
          </div>
        )}
        {debateId && method === RestMethodKeys.Update && (
          <span className="debate-settings debate-settings-update mr-2">
            <Link
              to={linkTo}
              className="btn btn-primary btn-sm"
              title="Edit this debate"
            >
              <i className="fa fa-edit" /> Bearbeiten
            </Link>
          </span>
        )}
        {debateId && method === RestMethodKeys.Delete && (
          <span className="debate-settings debate-settings-delete">
            <Link
              to={linkTo}
              className="btn btn-danger btn-sm"
              title="Delete this debate"
            >
              <i className="fa fa-trash" /> Löschen
            </Link>
          </span>
        )}
      </>
    </DebatePermission>
  );
};
