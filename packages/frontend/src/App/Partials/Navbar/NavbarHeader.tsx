import React from 'react';
import classNames from 'classnames';

export interface HeaderProps {
  className?: string;
  children: React.ReactNode;
  id: string;
  isHomepage: boolean;
  onResize: (props: {height: number; width: number;}) => void;
}

export interface HeaderState {
  clientWidth: number;
  innerHeight: number;
  scrollPosition: number;
}

export default class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps) {
    super(props);
    this.state = {
      scrollPosition: window.scrollY,
      innerHeight: window.innerHeight,
      clientWidth: window.innerWidth,
    };
  }

  private handleResize = () => {
    const {
      clientWidth,
      innerHeight,
    } = this.state;

    if (innerHeight !== window.innerHeight) {
      this.setState({
        innerHeight: window.innerHeight,
      });

      this.props.onResize({height: window.innerHeight, width: clientWidth});
    }

    if (clientWidth !== window.innerWidth) {
      this.setState({
        clientWidth: window.innerWidth,
      });

      this.props.onResize({height: innerHeight, width: window.innerWidth});
    }
  }

  private handleScroll = () => {
    const {
      scrollPosition,
    }= this.state;

    if (window.scrollY !== scrollPosition) {
      this.setState({
        scrollPosition: window.scrollY,
      });
    }
  }
  
  componentDidMount () {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  }

  public render() {
    const {
      children,
      className,
      id,
      isHomepage,
    } = this.props;

    const {
      innerHeight,
      scrollPosition,
    } = this.state;
    
    return (
      <header 
        className={classNames(className, {
          'header-home': isHomepage,
          'scrolled': scrollPosition > (innerHeight / 3),
        })}
        id={id}
      >
        {children}
        <div className="header-sub-bg"></div>
      </header>
    );
  }
}
