import { isEqual } from 'lodash';
import {
  alertAction,
  AlertTypes,
  DebateState,
  PublicRequestKeys,
  RequestStatus,
  RestMethodKeys,
  ToggleType,
} from '@platonist/library';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { usePrevious } from 'react-use';
import { Col, Form, Row } from 'reactstrap';

import {
  createDefaultData,
  FormClickEvent,
  FormContextValue,
  FormDataConfig,
  FormProvider,
} from '../../../../Library';
import {
  Checkbox,
  DateInput,
  Group,
  Input,
  SubmitButton,
  Text,
} from '../../../../Library/Form/Fields';
import { useDebates } from '../../../Hooks';
import { ModalWithRoute } from '../../Modal';
import {
  ArticleFetcherOnClear,
  ArticleFetcherOnReceive,
  FormArticleFetcher,
} from './FormArticleFetcher';
import { DebateFormData, debateFormData } from './FormData';
import { DebateSettingsProps } from './Settings';

export interface DebateFormProps extends DebateSettingsProps {
  debateDefault?: Partial<DebateFormData>;
  from: string;
  to: string;
}

const DebateModalHeader: FunctionComponent<{
  method: DebateFormProps['method'];
}> = ({ method }) => {
  switch (method) {
    case RestMethodKeys.Create:
      return <>Erstelle eine neue Debatte</>;
    case RestMethodKeys.Update:
      return <>Bearbeite diese Debatte</>;
    default:
      return null;
  }
};

const makeInputsEditable = <Data extends Object>(
  configs: FormDataConfig<Data>[],
): FormDataConfig<Data>[] =>
  configs.map((config) => {
    config.editable = true;
    if (config.group) {
      config.group = makeInputsEditable(config.group);
    }
    return config;
  });

export const DebateForm: FunctionComponent<DebateFormProps> = ({
  debateDefault,
  debateId,
  method,
  ...props
}) => {
  const {
    clear,
    send,
    state: { result: debate, status },
  } = useDebates<DebateState>({
    key: PublicRequestKeys.Debate,
    stateOnly: true,
  });

  const isDeleteMethod = method !== RestMethodKeys.Delete ? true : false;

  const dispatch = useDispatch();

  const [defaultData, setDefaultData] = useState(
    debateDefault || createDefaultData<Partial<DebateFormData>>(debateFormData),
  );

  const [formData, setFormData] = useState(
    (debateDefault && makeInputsEditable(debateFormData)) || debateFormData,
  );

  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [resetForm, setResetForm] = useState<boolean>(false);

  const prevDebateId = usePrevious(debateId);

  const handleSubmit = useCallback(
    (event: FormClickEvent<Partial<DebateFormData>>) => {
      const { data: submitData, isValid } = event.submitData;

      if (defaultData.articleAUrl) {
        if (submitData.articleA) {
          submitData.articleA = {
            ...submitData.articleA,
            url: defaultData.articleAUrl,
            isOffline: false,
          };
        }
        delete submitData.articleAUrl;
      }

      if (defaultData.articleBUrl) {
        if (submitData.articleB) {
          submitData.articleB = {
            ...submitData.articleB,
            url: defaultData.articleBUrl,
            isOffline: false,
          };
        }
        delete submitData.articleBUrl;
      }

      submitData.published = Boolean(submitData.published);

      if (status === RequestStatus.Initial && isValid && submitData) {
        send({
          method: (method === RestMethodKeys.Create && 'POST') || 'PUT',
          data: submitData as any,
          pathname: `debates${debateId ? '/' + debateId : ''}`,
        });
      }
    },
    [
      debateId,
      defaultData.articleAUrl,
      defaultData.articleBUrl,
      method,
      send,
      status,
    ],
  );

  const handelReceive: ArticleFetcherOnReceive<DebateFormData> = useCallback(
    (key, data) => {
      const newDefaultData = {
        ...defaultData,
        [key]: data,
      };

      const index = debateFormData.findIndex(
        (formData) => formData.key === key,
      );

      const config = index > 0 && formData[index];

      if (config && config.group && config.key === key) {
        config.group.map((conf: any) => {
          conf.editable = true;
          return conf;
        });

        setFormData((prevFormData) => {
          prevFormData[index] = config;
          return prevFormData;
        });
      }

      setDefaultData(newDefaultData);

      if (!resetForm) {
        setResetForm(true);
      }
    },
    [defaultData, formData, resetForm],
  );

  const handleClear: ArticleFetcherOnClear<DebateFormData> = useCallback(
    (key, [inputValue, setInputValue]) => {
      const index = debateFormData.findIndex(
        (formData) => formData.key === key,
      );

      const config = index > 0 && formData[index];

      if (config && config.group) {
        const defaults = {
          ...defaultData,
          [key]: createDefaultData(config.group),
        };

        setDefaultData(defaults);

        if (inputValue) {
          setInputValue(key, {
            ...inputValue,
            isValid: false,
            pristine: true,
            touched: false,
            disabled: false,
            defaultValue: defaults[key] as any,
            value: defaults[key] as any,
          });
        }

        config.group.map((conf: any) => {
          conf.editable = false;
          return conf;
        });

        setFormData((prevFormData) => {
          prevFormData[index] = config;
          return prevFormData;
        });
      }
    },
    [defaultData, formData],
  );

  const handleModalClose = useCallback(() => {
    setDefaultData(createDefaultData<Partial<DebateFormData>>(debateFormData));

    if (!resetForm) {
      setResetForm(true);
    }
  }, [resetForm]);

  const handleChange = useCallback(
    (context: FormContextValue<DebateFormData>) => {
      const { submitData } = context;

      if (submitData && !debateDefault) {
        setDefaultData({
          ...defaultData,
          ...submitData.data,
        });
      }
    },
    [debateDefault, defaultData],
  );

  useEffect(() => {
    if (resetForm) {
      setResetForm(false);
      return;
    }

    if (
      (!defaultData && debateDefault) ||
      (debateDefault && defaultData.id !== debateDefault?.id)
    ) {
      setDefaultData(debateDefault);
    }

    if (status === RequestStatus.Error) {
      clear();
    }

    if (status === RequestStatus.Loaded && debate) {
      clear();
      if (method) {
        dispatch(
          alertAction.add({
            id: `${method}_debate_success`,
            message: `Debate successfully ${
              (method && RestMethodKeys.Update && 'updated') || 'created'
            }`,
            state: ToggleType.Show,
            type: AlertTypes.Success,
          }),
        );
      }

      if (!shouldRedirect) {
        setShouldRedirect(true);
      }
    }

    if (shouldRedirect) {
      setShouldRedirect(false);
      setDefaultData(
        createDefaultData<Partial<DebateFormData>>(debateFormData),
      );
    }

    const dataIsEqual = isEqual(defaultData, debateDefault);

    if (!dataIsEqual) {
      if (debateDefault) {
        setDefaultData(debateDefault);
        setResetForm(true);
      }
    }
  }, [
    clear,
    debate,
    debateDefault,
    debateId,
    defaultData,
    dispatch,
    method,
    prevDebateId,
    resetForm,
    shouldRedirect,
    status,
  ]);

  return (
    <FormProvider
      data={defaultData}
      inputConfig={formData}
      onChange={handleChange}
      preValidate={true}
      reset={resetForm || shouldRedirect}
    >
      <ModalWithRoute
        {...props}
        backdrop="static"
        footer={
          <SubmitButton
            color="success"
            onClick={handleSubmit}
            disabled={status === RequestStatus.Updating}
          >
            Speichern
          </SubmitButton>
        }
        header={<DebateModalHeader method={method} />}
        size={isDeleteMethod ? 'xl' : 'sm'}
        onClosed={handleModalClose}
      >
        <Form>
          <Row>
            <Col sm={7}>
              <Row>
                <Col>
                  <Checkbox inputKey="published" />
                </Col>
                <Col>
                  <Checkbox inputKey="archived" />
                </Col>
              </Row>
              <DateInput inputKey="archiveDate" />
              <Input inputKey="title" />
              <Input inputKey="subTitle" />
              <Text inputKey="shortDescription" />
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <FormArticleFetcher
                dataKey="articleA"
                inputKey="articleAUrl"
                onClear={handleClear}
                onReceive={handelReceive}
              />
              <Group inputKey="articleA" />
            </Col>
            <Col sm={6}>
              <FormArticleFetcher
                dataKey="articleB"
                inputKey="articleBUrl"
                onClear={handleClear}
                onReceive={handelReceive}
              />
              <Group inputKey="articleB" />
            </Col>
          </Row>
        </Form>
      </ModalWithRoute>
      {shouldRedirect && <Redirect to={props.from} />}
    </FormProvider>
  );
};
