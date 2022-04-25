import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from 'react-use';
import { Button, Col, FormGroup, Label, Row } from 'reactstrap';

import {
  Article,
  GlobalState,
  PrivateRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  useConfig,
} from '@platonist/library';

import {
  FormContext,
  FormContextValue,
  FormDataItem,
  SetFormValueFn,
  useInputValue,
} from '../../../../Library';
import { Input } from '../../../../Library/Form/Fields';
import { ArticleItem } from '../../Article';
import { DebateFormData } from './FormData';

export type ArticleFetcherOnReceive<Data extends Object> = (
  key: keyof Data,
  data: Data,
) => void;

export type ArticleFetcherOnClear<Data extends Object> = (
  key: keyof Data,
  cb: [FormDataItem<Article> | undefined, SetFormValueFn<Article>, string],
) => void;

export interface FormArticleFetcherProps<Data extends Object> {
  dataKey: keyof Data;
  inputKey: keyof Data;
  onReceive?: ArticleFetcherOnReceive<Data>;
  onClear?: ArticleFetcherOnClear<Data>;
}

export const FormArticleFetcher: FunctionComponent<
  FormArticleFetcherProps<DebateFormData>
> = ({ dataKey, inputKey, onReceive, onClear }) => {
  const config = useConfig();
  const dispatch = useDispatch<ReactReduxRequestDispatch>();
  const context = useContext(
    FormContext as React.Context<FormContextValue<Article> | undefined>,
  );

  const [inputValue, setFormValue] = useInputValue<Article>(
    inputKey as keyof Article,
  );

  const articleInputValue = useInputValue<Article>(dataKey as keyof Article);

  const { result: article, status } = useSelector<
    GlobalState,
    GlobalState[PrivateRequestKeys.Article]
  >((state) => state.article);

  const prevStatus = usePrevious(status);

  const hasArticle =
    article && article.title && article.key === dataKey ? true : false;

  const [articleState, setArticleState] = useState(article);

  const handleUpload = useCallback(() => {
    if (!inputValue) {
      return;
    }

    const url = config.createApiUrl(config.api.config);
    url.pathname = '/articles/fetch-url';

    if (inputValue.isValid && status === RequestStatus.Initial) {
      dispatch(
        requestAction.load(PrivateRequestKeys.Article, {
          method: 'POST',
          url: url.href,
          withCredentials: true,
          data: {
            key: dataKey,
            url: inputValue.value,
          },
        }),
      );
    }
  }, [config, dataKey, dispatch, inputValue, status]);

  const handleClear = useCallback(() => {
    if (!inputValue) {
      return;
    }

    if (inputValue.touched && !inputValue.pristine && inputValue.value) {
      dispatch(requestAction.clear(PrivateRequestKeys.Article));

      setFormValue(inputKey, {
        ...inputValue,
        isValid: false,
        pristine: true,
        touched: false,
        disabled: false,
        value: '',
      });

      if (onClear) {
        onClear(dataKey, articleInputValue);
      }

      if (articleState) {
        setArticleState(undefined);
      }
    }
  }, [
    inputValue,
    dispatch,
    setFormValue,
    inputKey,
    onClear,
    articleState,
    dataKey,
    articleInputValue,
  ]);

  useEffect(() => {
    if (!inputValue) {
      return;
    }

    if (
      prevStatus === RequestStatus.Updating &&
      status === RequestStatus.Loaded &&
      hasArticle
    ) {
      const formData = context?.data[dataKey as keyof Partial<Article>];
      const formValue = formData?.value as string;

      const newData: FormDataItem<any>['value'] = {};

      if (formValue && formData && article) {
        Object.keys(article).forEach((key: string) => {
          const item = article[key as keyof Article];
          const formItem = formValue[key as any];
          const hasData =
            (formItem || typeof formItem === 'string') && item ? true : false;

          if (hasData) {
            Object.assign(newData, {
              [key]:
                key === 'keywords' ? item && (item as any).join(', ') : item,
            });
          }
        });

        if (article.key === dataKey) {
          setFormValue(dataKey, {
            ...formData,
            defaultValue: newData,
            value: newData,
          });
          if (onReceive) {
            onReceive(dataKey, newData);
          }
        }
      }
      setArticleState(article);
      dispatch(requestAction.clear(PrivateRequestKeys.Article));
    }
  }, [
    article,
    context?.data,
    dataKey,
    dispatch,
    hasArticle,
    inputKey,
    inputValue,
    onReceive,
    prevStatus,
    setFormValue,
    status,
  ]);

  if (!inputValue) {
    return null;
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <Label>{inputValue.config?.title}</Label>
        </Col>
        <Col>
          <Input inputKey={inputKey} hideLabel={true} />
        </Col>
        <Col xs={3}>
          <FormGroup>
            <Button
              size="sm"
              className="w-50"
              disabled={!inputValue.disabled}
              onClick={handleClear}
            >
              <i className="fa fa-times" />
            </Button>
            <Button
              size="sm"
              color="primary"
              className="w-50"
              disabled={
                !inputValue.isValid ||
                (status === RequestStatus.Loaded && hasArticle)
                  ? true
                  : false
              }
              onClick={handleUpload}
            >
              <i className="fa fa-eye" />
            </Button>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col>{articleState && <ArticleItem {...articleState} />}</Col>
      </Row>
    </>
  );
};
