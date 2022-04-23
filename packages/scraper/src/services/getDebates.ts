import { Debate } from 'platonist-library';
import { request } from '../library';

export const getDebates = async () =>
  request<Debate[]>('debates', {
    _sort: 'created_at:DESC',
  });
