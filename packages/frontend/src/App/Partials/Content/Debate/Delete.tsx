import { parse } from 'qs';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import {
  alertAction,
  AlertTypes,
  Debate,
  GlobalState,
  PublicRequestKeys,
  RequestStatus,
  ToggleType,
} from '@platonist/library';
import { useDebates } from '../../../Hooks';
import { ModalWithRoute } from '../../Modal';
import { cleanParsedSearch, CurrentSearchProps } from './FormEdit';

export interface DebateDeleteProps {
  debate?: Debate;
  from: string;
  to: string;
}

export const DebateDelete: React.FunctionComponent<DebateDeleteProps> = ({
  debate,
  ...props
}) => {
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const dispatch = useDispatch();

  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state.router);

  const {
    clear,
    remove,
    state: { status },
  } = useDebates({
    key: PublicRequestKeys.Debate,
    id: debate?.id,
    stateOnly: true,
  });

  const currentSearch = parse(
    cleanParsedSearch(location.search),
  ) as CurrentSearchProps;

  const handleDelete = useCallback(() => {
    if (status === RequestStatus.Initial) {
      remove();
    }
  }, [remove, status]);

  const handleCancel = useCallback(() => {
    if (!shouldRedirect) {
      setShouldRedirect(true);
    }
  }, [shouldRedirect]);

  useEffect(() => {
    if (status === RequestStatus.Error) {
      clear();
    }
    if (status === RequestStatus.Loaded && !shouldRedirect) {
      setShouldRedirect(true);
      dispatch(
        alertAction.add({
          id: 'delete_debate_success',
          message: 'Debate successfully deleted',
          state: ToggleType.Show,
          type: AlertTypes.Success,
        }),
      );
      clear();
    }
    if (shouldRedirect) {
      setShouldRedirect(false);
    }
  }, [clear, currentSearch, dispatch, location, shouldRedirect, status]);

  if (!debate || Number(currentSearch.id) !== debate?.id) {
    return null;
  }

  return (
    <>
      <ModalWithRoute
        {...props}
        header={'Delete Debate'}
        footer={
          <>
            <button className="btn btn-primary btn-sm" onClick={handleCancel}>
              Abbrechen
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>
              Löschen
            </button>
          </>
        }
      >
        Du löscht die Debatte <b>{debate.title}</b>. Bist du dir sicher?
      </ModalWithRoute>
      {shouldRedirect && <Redirect to={props.from} />}
    </>
  );
};
