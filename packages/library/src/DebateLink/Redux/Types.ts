import { Debate } from '../../Models';
import { clearDebateLink, setDebateLink } from './Actions';

export interface DebateLinkState {
  debate?: Debate;
  id?: Pick<Debate, 'id'>;
}

export type DebateLinkActions =
  | ReturnType<typeof clearDebateLink>
  | ReturnType<typeof setDebateLink>;

export interface DebateLinkDispatch {
  <A extends DebateLinkActions>(action: A): A;
}
