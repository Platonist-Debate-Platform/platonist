import { Logic } from 'redux-logic/definitions/logic';

import { createRequestLogic } from './CreateLogic';
import { createReducer } from './CreateReducer';
import { KeysOfRequestIDs, ReactReduxRequestProps } from './Types';

export class ReactReduxRequest {
  private props: ReactReduxRequestProps;

  constructor(props: ReactReduxRequestProps) {
    this.props = props;
  }

  createLogic(): Logic<Object, any, any, any, any, any>[] {
    // TODO - Add settings
    return this.identifiers.map((identifier) =>
      createRequestLogic(identifier, {}),
    );
  }

  createReducer(): { [key: string]: ReturnType<typeof createReducer> } {
    const reducer: { [key: string]: ReturnType<typeof createReducer> } = {};
    this.identifiers.forEach((identifier) =>
      Object.assign(reducer, { [identifier]: createReducer(identifier) }),
    );
    return reducer;
  }

  private get identifiers(): KeysOfRequestIDs[] {
    return [...this.props.identifiers.public, ...this.props.identifiers.secure];
  }

  public get settings(): ReactReduxRequestProps['settings'] {
    return this.props.settings;
  }
}

export default ReactReduxRequest;
