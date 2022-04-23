import { Article, Debate } from '@platonist/library';

import {
  FormDataConfig,
  FormInputTypes,
  FormValidationTypes,
} from '../../../../Library';

export interface DebateFormData extends Debate {
  articleAUrl: string;
  articleBUrl: string;
}

export const createDebateArticleGroupData = (): FormDataConfig<
  Partial<Article>
>[] => [
  {
    editable: false,
    key: 'title',
    required: true,
    title: 'Title',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: false,
    key: 'description',
    required: true,
    title: 'Description',
    type: FormInputTypes.Text,
    validate: FormValidationTypes.Length,
  },
  {
    editable: false,
    key: 'provider',
    required: true,
    title: 'Provider',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: false,
    key: 'type',
    required: true,
    title: 'Type',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: false,
    key: 'icon',
    required: true,
    title: 'Icon',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: false,
    key: 'icon',
    required: true,
    title: 'Icon url',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: false,
    key: 'image',
    required: true,
    title: 'Image url',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: false,
    key: 'language',
    required: true,
    title: 'language',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: false,
    key: 'keywords',
    required: true,
    title: 'Keywords',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
];

export const debateArticleGroupData = createDebateArticleGroupData();

export const debateFormData: FormDataConfig<Partial<DebateFormData>>[] = [
  {
    editable: true,
    key: 'published',
    required: false,
    title: 'Published',
    type: FormInputTypes.Checkbox,
  },
  {
    editable: true,
    key: 'archived',
    required: false,
    title: 'Archive debate',
    type: FormInputTypes.Checkbox,
  },
  {
    editable: true,
    key: 'archiveDate',
    datePickerSettings: {
      showTimeSelect: true,
      dateFormat: 'dd/MM/yyyy-HH:mm',
      timeFormat: 'HH:mm',
    },
    required: false,
    title: 'Archive Date',
    type: FormInputTypes.Date,
  },
  {
    editable: true,
    key: 'title',
    required: true,
    title: 'Debate title',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: true,
    key: 'subTitle',
    required: true,
    title: 'Debate subtitle',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: true,
    key: 'shortDescription',
    required: true,
    title: 'Short description',
    type: FormInputTypes.Text,
    validate: FormValidationTypes.Length,
  },
  {
    editable: true,
    key: 'articleAUrl',
    required: true,
    title: 'Url to Article A',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Url,
  },
  {
    editable: true,
    key: 'articleA',
    required: true,
    title: 'Article Data',
    type: FormInputTypes.Group,
    group: createDebateArticleGroupData(),
  },
  {
    editable: true,
    key: 'articleBUrl',
    required: true,
    title: 'Url to Article A',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Url,
  },
  {
    editable: true,
    key: 'articleB',
    required: true,
    title: 'Article B',
    type: FormInputTypes.Group,
    group: createDebateArticleGroupData(),
  },
];
