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
    title: 'Beschreibung',
    type: FormInputTypes.Text,
    validate: FormValidationTypes.Length,
  },
  {
    editable: false,
    key: 'provider',
    required: true,
    title: 'Anbieter',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: false,
    key: 'type',
    required: true,
    title: 'Typ',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: false,
    key: 'icon',
    required: true,
    title: 'Symbol',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: false,
    key: 'icon',
    required: true,
    title: 'Symbol URL',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: false,
    key: 'image',
    required: true,
    title: 'Bild URL',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: false,
    key: 'language',
    required: true,
    title: 'Sprache',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: false,
    key: 'keywords',
    required: true,
    title: 'Schlagwörter',
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
    title: 'Veröffentlicht',
    type: FormInputTypes.Checkbox,
  },
  {
    editable: true,
    key: 'archived',
    required: false,
    title: 'Archiviere Debatte',
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
    title: 'Datum der Archivierung',
    type: FormInputTypes.Date,
  },
  {
    editable: true,
    key: 'title',
    required: true,
    title: 'Debattentitel',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: true,
    key: 'subTitle',
    required: true,
    title: 'Debattenuntertitel',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: true,
    key: 'shortDescription',
    required: true,
    title: 'Kurze Beschreibung',
    type: FormInputTypes.Text,
    validate: FormValidationTypes.Length,
  },
  {
    editable: true,
    key: 'articleAUrl',
    required: true,
    title: 'URL zu Artikel A',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Url,
  },
  {
    editable: true,
    key: 'articleA',
    required: true,
    title: 'Artikel A',
    type: FormInputTypes.Group,
    group: createDebateArticleGroupData(),
  },
  {
    editable: true,
    key: 'articleBUrl',
    required: true,
    title: 'URL zu Artikel B',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Url,
  },
  {
    editable: true,
    key: 'articleB',
    required: true,
    title: 'Artikel B',
    type: FormInputTypes.Group,
    group: createDebateArticleGroupData(),
  },
];
