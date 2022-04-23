import React, { ReactNode } from 'react';
import requestAnimationFrame from 'raf';

export const memoryStore = {
  _data: new Map(),
  get(key: string) {
    if (!key) {
      return null
    }

    return this._data.get(key) || null
  },
  set(key: string, data: any) {
    if (!key) {
      return
    }
    return this._data.set(key, data)
  }
}

const createMemoryStore = () => memoryStore; 

function scroll(target: (Window & typeof globalThis | HTMLElement), x: number, y: number) {
  if (target instanceof window.Window) {
    target.scrollTo(x, y)
  } else {
    target.scrollLeft = x
    target.scrollTop = y
  }
}

function getScrollPosition(target: (Window & typeof globalThis | HTMLElement)) {
  if (target instanceof window.Window) {
    return { x: target.scrollX, y: target.scrollY }
  }

  return { x: target.scrollLeft, y: target.scrollTop }
}

interface ScrollPositionManagerProps {
  scrollKey: string;
  scrollStore?: ReturnType<typeof createMemoryStore>;
}

export const ScrollManagerContext = React.createContext<ScrollPositionManagerProps & {
  connectScrollTarget?: (node: Window & typeof globalThis | HTMLElement) => void
}>({
  scrollKey: '',
});

export default class ScrollManager extends React.Component<ScrollPositionManagerProps & {children?: ReactNode}> {
  _target: Window & typeof globalThis | HTMLElement;
  scrollStore: ReturnType<typeof createMemoryStore>;

  constructor(props: ScrollPositionManagerProps & {children?: ReactNode}) {
    super(props)
    this.connectScrollTarget = this.connectScrollTarget.bind(this)
    this._target = window
    this.scrollStore = this.props.scrollStore || memoryStore;
    
    this.saveScrollPosition = this.saveScrollPosition.bind(this);
  }

  connectScrollTarget(node: Window & typeof globalThis | HTMLElement) {
    this._target = node
  }

  restoreScrollPosition(pos?: {x: number, y: number}) {
    pos = pos || this.scrollStore.get(this.props.scrollKey);
    
    if (this._target && pos) {
      requestAnimationFrame(() => {
        if (pos) {
          scroll(this._target, pos.x, pos.y)
        }
      })
    }
  }

  saveScrollPosition(key?: string) {
    if (this._target) {
      const pos = getScrollPosition(this._target)
      key = key || this.props.scrollKey
      this.scrollStore.set(key, pos);
      window.sessionStorage.setItem(key, JSON.stringify(pos));
    }
  }

  componentDidMount() {
    this.restoreScrollPosition();

    (document.body as HTMLBodyElement).onunload = (ev) => {
      this.saveScrollPosition();
    }
  }

  UNSAFE_componentWillUpdate(nextProps: ScrollPositionManagerProps) {
    if (this.props.scrollKey !== nextProps.scrollKey) {
      this.saveScrollPosition()
    }
  }

  componentDidUpdate(prevProps: ScrollPositionManagerProps) {
    if (this.props.scrollKey !== prevProps.scrollKey) {
      this.restoreScrollPosition()
    }
  }

  componentWillUnmount() {
    this.saveScrollPosition();
    
  }

  render() {
    const { children = null, ...props } = this.props;

    return (
      <ScrollManagerContext.Provider value={{...props, connectScrollTarget: this.connectScrollTarget}}>
        {children}
      </ScrollManagerContext.Provider>
    );
    // return (
    //   children &&
    //   children({ ...props, connectScrollTarget: this.connectScrollTarget })
    // )
  }
}

