import {
  ApplicationKeys,
  Debate,
  GlobalState,
  PublicRequestKeys,
  RestMethodKeys,
} from '@platonist/library';
import { parse, ParsedQs, stringify } from 'qs';
import { FunctionComponent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  createDefaultData,
  getDefaultDataFromResult,
} from '../../../../Library';
import { DebateDelete } from './Delete';
import { DebateForm } from './Form';
import {
  debateArticleGroupData,
  DebateFormData,
  debateFormData,
} from './FormData';

export const cleanParsedSearch = (search: string) => {
  if (search.charAt(0) === '?') {
    return search.substring(1);
  }
  return search;
};

const debateToFormData = (
  debate?: Partial<DebateFormData>,
): Partial<DebateFormData> | undefined => {
  if (!debate) {
    return undefined;
  }
  const articleA = debate.articleA
    ? getDefaultDataFromResult(debate.articleA, debateArticleGroupData)
    : createDefaultData(debateArticleGroupData);

  const articleB = debate.articleB
    ? getDefaultDataFromResult(debate.articleB, debateArticleGroupData)
    : createDefaultData(debateArticleGroupData);

  const defaultData = getDefaultDataFromResult(debate, debateFormData);

  return {
    ...defaultData,
    articleA: articleA,
    articleAUrl: debate.articleA?.url || '',
    articleB: articleB,
    articleBUrl: debate.articleB?.url || '',
  };
};

export interface DebateFormItemProps {
  debates?: Debate[];
  from: string;
}

export interface CurrentSearchProps extends ParsedQs {
  modal: ApplicationKeys;
  method: RestMethodKeys;
  id: string;
}

export const DebateFormEdit: FunctionComponent<DebateFormItemProps> = ({
  debates,
  from,
}) => {
  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state.router);

  const currentSearch = parse(
    cleanParsedSearch(location.search),
  ) as CurrentSearchProps;

  const [debate, setDebate] = useState(
    currentSearch.id && debates
      ? debates.find((d) => d.id === Number(currentSearch.id))
      : undefined,
  );

  useEffect(() => {
    const newDebate =
      currentSearch.id && debates
        ? debates.find((d) => d.id === Number(currentSearch.id))
        : undefined;

    const hastSearchId = currentSearch && currentSearch.id ? true : false;

    if (hastSearchId && newDebate && !debate) {
      setDebate(newDebate);
    }

    // if (newDebate?.id !== debate?.id && location.search.length > 0) {
    //   setDebate(newDebate);
    // }
    // if (!currentSearch.id && debate) {
    //   setDebate(undefined);
    // }
  }, [currentSearch, currentSearch.id, debate, debate?.id, debates, location]);

  if (currentSearch.method === RestMethodKeys.Delete) {
    return (
      <DebateDelete
        debate={debate}
        from={from}
        to={`${location.pathname}?${stringify(currentSearch)}`}
      />
    );
  }

  return (
    <DebateForm
      debateDefault={
        (currentSearch.method === RestMethodKeys.Update &&
          debateToFormData(debate)) ||
        undefined
      }
      debateId={currentSearch?.id ? Number(currentSearch.id) : undefined}
      from={from}
      method={currentSearch.method}
      to={`${location.pathname}?${stringify(currentSearch)}`}
    />
  );
};
