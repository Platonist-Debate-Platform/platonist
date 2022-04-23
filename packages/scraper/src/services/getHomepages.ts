import { Homepage } from 'platonist-library';
import { request } from '../library';

export const getHomepages = async () => request<Homepage[]>('homepages');
