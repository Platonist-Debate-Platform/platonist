import { Comment, PrivateRequestKeys } from '@platonist/library';
import useRequest from './useRequest';

export const useComment = (id: Comment['id'], stateOnly: boolean = true) => {
  return useRequest({
    id: Number(id),
    key: PrivateRequestKeys.Comment,
    path: 'comments',
    stateOnly,
  });
};

export default useComment;
