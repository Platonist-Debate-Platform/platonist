import { Page } from 'platonist-library';
import { request } from '../library';

export const getPages = async () => request<Page[]>('pages');
