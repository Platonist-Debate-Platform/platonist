import { Component, MouseEvent, ReactNode } from 'react';
import { Collapse } from 'reactstrap';
import classNames from 'classnames';

export interface CollapseHoverProps {
  className?: string;
  isOpen?: boolean;
  collapseChildren: ReactNode;
  children: ReactNode;
}

export interface CollapseHoverState {
  isOpen: boolean;
}

export class CollapseHover extends Component<
  CollapseHoverProps,
  CollapseHoverState
> {
  constructor(props: CollapseHoverProps) {
    super(props);

    this.state = {
      isOpen: props.isOpen || false,
    };
  }

  private handleMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
    const { isOpen } = this.state;

    if (!isOpen) {
      this.setState({ isOpen: true });
    }
  };

  private handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    const { isOpen } = this.state;

    if (isOpen) {
      this.setState({ isOpen: false });
    }
  };

  public toggle = () => {};

  render() {
    const { children, collapseChildren } = this.props;

    const { isOpen } = this.state;

    return (
      <div
        className={classNames('collapse-hover', classNames)}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div className="collapse-hover-inner">
          {children}
          <Collapse isOpen={isOpen}>{collapseChildren}</Collapse>
        </div>
      </div>
    );
  }
}
