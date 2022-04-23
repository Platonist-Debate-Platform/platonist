import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useScroll, useWindowScroll } from 'react-use';

import { QueryParameterBase } from '../ReactReduxRequest';

export interface ScrollPagerProps {
  count: number;
  onReach: (query: QueryParameterBase) => void;
  query: QueryParameterBase;
  useWindow: boolean;
}

export const ScrollPager: FunctionComponent<
  PropsWithChildren<ScrollPagerProps>
> = ({ children, count, onReach, query: defaultQuery, useWindow }) => {
  const childRef = useRef<HTMLDivElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);

  const refScroll = useScroll(parentRef);
  const windowScroll = useWindowScroll();

  const [query, setQuery] = useState(defaultQuery);
  const [achievedBottom, setAchievedBottom] = useState(false);

  useEffect(() => {
    const scrollPosition = useWindow ? windowScroll : refScroll;

    const parentHeight = useWindow
      ? window.innerHeight
      : parentRef.current?.scrollHeight;

    const childHeight =
      (useWindow
        ? parentRef.current?.scrollHeight
        : childRef.current?.scrollHeight) || 0;

    const parentBottomEdge = scrollPosition.y + (parentHeight || 0);

    if (
      Math.min(parentBottomEdge, childHeight) === childHeight &&
      !achievedBottom
    ) {
      setAchievedBottom(true);

      const _start = (query._start || 0) + (query._limit || 0);

      if (query._start !== _start && count > _start) {
        const newQuery = {
          ...query,
          _start: (query._start || 0) + (query._limit || 0),
        };
        setQuery(newQuery);
        onReach(newQuery);
      }
    }

    if (
      Math.min(parentBottomEdge, childHeight || 0) !== childHeight &&
      achievedBottom
    ) {
      setAchievedBottom(false);
    }
  }, [
    achievedBottom,
    count,
    onReach,
    query,
    refScroll,
    useWindow,
    windowScroll,
  ]);

  return useWindow ? (
    <div ref={parentRef}>{children}</div>
  ) : (
    <div ref={parentRef}>
      <div ref={childRef}>{children}</div>
    </div>
  );
};
