import { GlobalState, PublicRequestKeys } from '@platonist/library';
import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from 'react';

import { Collapse } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { usePrevious } from 'react-use';
import { useSelector } from 'react-redux';

export interface CollapseWithRouteProps {
  children: ReactNode;
  close?: boolean;
  from: string;
  onEntered?: () => void;
  onExited?: () => void;
  to: string;
}

export const CollapseWithRoute: FunctionComponent<CollapseWithRouteProps> = ({
  children,
  close,
  from,
  onEntered,
  onExited,
  to,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const prevClose = usePrevious(close);

  const router = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state.router);

  const getCurrentUrlFromLocation = (
    location: GlobalState[PublicRequestKeys.Router]['location'],
  ) => `${location.pathname}${location.search}`;

  useEffect(() => {
    const currentUrl = getCurrentUrlFromLocation(router.location);
    const isFromUrl = from === currentUrl;
    const isToUrl = currentUrl.indexOf(to) > -1;

    if (isOpen && !isToUrl) {
      setIsOpen(false);
    }

    if (isFromUrl && !isToUrl && isOpen) {
      setIsOpen(false);
      setShouldRedirect(false);
    }
    if (isToUrl && !isFromUrl && !isOpen) {
      setIsOpen(true);
    }

    if (!prevClose && close) {
      setIsOpen(false);
    }
  }, [close, from, isOpen, prevClose, router, to]);

  return (
    <>
      <Collapse isOpen={isOpen} onEntered={onEntered} onExited={onExited}>
        {children}
      </Collapse>
      {shouldRedirect && (
        <Redirect from={getCurrentUrlFromLocation(router.location)} to={from} />
      )}
    </>
  );
};
