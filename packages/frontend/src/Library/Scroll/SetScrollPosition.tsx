import React, { ReactNode } from 'react';
import Cookies from 'js-cookie';
import { connect } from 'react-redux';
import { GlobalState, PublicRequestKeys } from '@platonist/library';

interface ScrollPositionProps {
  [PublicRequestKeys.Router]: GlobalState[PublicRequestKeys.Router];
  name?: string;
  children: ReactNode;
}

interface Coords {
  x: number;
  y: number;
}

export class SetScrollPositionBase extends React.Component<ScrollPositionProps> {
  private body: HTMLBodyElement;

  constructor(props: ScrollPositionProps) {
    super(props);
    this.body = document.body as HTMLBodyElement;
  }

  private get cookieName(): string {
    return this.props.name
      ? `scrollPosition_${this.props.name}`
      : 'scrollPosition';
  }

  private setPosition() {
    const position = {
      x: window.scrollX,
      y: window.scrollY,
    };

    return position;
  }

  private handleUnload = (ev: Event) => {
    const position = this.setPosition();
    Cookies.set(this.cookieName, JSON.stringify(position), {
      expires: 1,
    });
  };

  public componentDidMount() {
    this.body.onunload = this.handleUnload;

    const positionFromCookie: string | undefined = Cookies.get(this.cookieName);
    const position: Coords | undefined =
      positionFromCookie && JSON.parse(positionFromCookie);

    if (position) {
      Cookies.remove(this.cookieName);

      setTimeout(() => {
        window.scrollTo(position.x, position.y);
      }, 1000);
    }
  }

  public componentDidUpdate(prevProps: ScrollPositionProps) {
    const { location } = this.props.router;

    const pattern = /\?.*(modal=|edit=|view=)/;
    const isModal = pattern.test(location.search);
    const isModalPrev = pattern.test(prevProps.router.location.search);

    if (!isModal && !isModalPrev && location !== prevProps.router.location) {
      window.scrollTo(0, 0);
    }
  }

  public componentWillUnmount() {
    this.body.onunload = null;
  }

  public render() {
    return this.props.children;
  }
}

export const SetScrollPosition = connect((state: GlobalState) => ({
  [PublicRequestKeys.Router]: state[PublicRequestKeys.Router],
}))(SetScrollPositionBase);
