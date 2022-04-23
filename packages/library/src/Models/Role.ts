/* eslint-disable no-shadow */

import { AxiosRequestConfig } from 'axios';

import { ReactReduxRequestState } from '../ReactReduxRequest';
import { User } from './User';

export interface PermissionPolicy {
  enabled: boolean;
  policy: string;
}

export enum RestMethodKeys {
  Count = 'count',
  Create = 'create',
  Delete = 'delete',
  Find = 'find',
  Findone = 'findone',
  Update = 'update',
}

export interface RestApplicationPermission {
  [RestMethodKeys.Count]: PermissionPolicy;
  [RestMethodKeys.Create]: PermissionPolicy;
  [RestMethodKeys.Delete]: PermissionPolicy;
  [RestMethodKeys.Find]: PermissionPolicy;
  [RestMethodKeys.Findone]: PermissionPolicy;
  [RestMethodKeys.Update]: PermissionPolicy;
}

export interface RolePermissionContentManagerMethods {
  checkuidavailability: PermissionPolicy;
  generateuid: PermissionPolicy;
}

export interface ComponentReadPermission {
  findcomponent: PermissionPolicy;
  listcomponents: PermissionPolicy;
  updatecomponent: PermissionPolicy;
}

export interface ComponentWritePermission {
  createcomponent: PermissionPolicy;
  deletecomponent: PermissionPolicy;
}

export interface ComponentCategoryWritePermission {
  deletecategory: PermissionPolicy;
  editcategory: PermissionPolicy;
}

export interface ContentTypePermission {
  findcontenttype: PermissionPolicy;
  listcontenttypes: PermissionPolicy;
  updatecontenttype: PermissionPolicy;
}

export interface ContentManagerController {
  components: ComponentReadPermission;
  contentmanager: RestApplicationPermission &
    RolePermissionContentManagerMethods;
  contenttypes: ContentTypePermission;
}

export interface BuilderPermission {
  getreservednames: PermissionPolicy;
}

export interface ConnectionPermission {
  getconnections: PermissionPolicy;
}

export interface ContentTypeBuilderPermission {
  createcontenttype: PermissionPolicy;
  deletecontenttype: PermissionPolicy;
  getcontenttype: PermissionPolicy;
  getcontenttypes: PermissionPolicy;
  updatecontenttype: PermissionPolicy;
}

export interface ContentTypeBuilderController {
  builder: BuilderPermission;
  componentcategories: ComponentCategoryWritePermission;
  components: ComponentReadPermission & ComponentWritePermission;
  connections: ConnectionPermission;
  contenttypes: ContentTypeBuilderPermission;
}

export interface RolePermissionInformationDescription {
  short: string;
  long: string;
}
export interface RolePermissionInformation {
  description: RolePermissionInformationDescription;
  icon: string;
  id: string;
  isCompatible: boolean;
  logo: string;
  name: string;
  price: number;
  ratings: number;
  registry: string;
}

export interface RolePermission<Controller> {
  controllers: Controller;
  information?: RolePermissionInformation;
}

export interface DocumentationPermission {
  deletedoc: PermissionPolicy;
  getinfos: PermissionPolicy;
  index: PermissionPolicy;
  login: PermissionPolicy;
  loginview: PermissionPolicy;
  regeneratedoc: PermissionPolicy;
  updatesettings: PermissionPolicy;
}

export interface EmailPermission {
  send: PermissionPolicy;
}

export interface UploadProxyPermission {
  uploadproxy: PermissionPolicy;
}

export interface UploadPermission {
  count: PermissionPolicy;
  destroy: PermissionPolicy;
  find: PermissionPolicy;
  findone: PermissionPolicy;
  getsettings: PermissionPolicy;
  search: PermissionPolicy;
  updatesettings: PermissionPolicy;
  upload: PermissionPolicy;
}

export interface UploadControllerPermission {
  proxy: UploadProxyPermission;
  upload: UploadPermission;
}

export interface AuthPermission {
  callback: PermissionPolicy;
  connect: PermissionPolicy;
  emailconfirmation: PermissionPolicy;
  forgotpassword: PermissionPolicy;
  register: PermissionPolicy;
  resetpassword: PermissionPolicy;
  sendemailconfirmation: PermissionPolicy;
}

export interface UserPermissions {
  count: PermissionPolicy;
  create: PermissionPolicy;
  destroy: PermissionPolicy;
  destroyall: PermissionPolicy;
  find: PermissionPolicy;
  findone: PermissionPolicy;
  me: PermissionPolicy;
  update: PermissionPolicy;
}

export interface UsersPermissions {
  createrole: PermissionPolicy;
  deleteprovider: PermissionPolicy;
  deleterole: PermissionPolicy;
  getadvancedsettings: PermissionPolicy;
  getemailtemplate: PermissionPolicy;
  getpermissions: PermissionPolicy;
  getpolicies: PermissionPolicy;
  getproviders: PermissionPolicy;
  getrole: PermissionPolicy;
  getroles: PermissionPolicy;
  getroutes: PermissionPolicy;
  index: PermissionPolicy;
  init: PermissionPolicy;
  searchusers: PermissionPolicy;
  updateadvancedsettings: PermissionPolicy;
  updateemailtemplate: PermissionPolicy;
  updateproviders: PermissionPolicy;
  updaterole: PermissionPolicy;
}

export interface UsersPermission {
  auth: AuthPermission;
  user: UserPermissions;
  userspermissions: UsersPermissions;
}

export enum ApplicationKeys {
  Article = 'article',
  Author = 'author',
  Comment = 'comment',
  Debate = 'debate',
  Homepage = 'homepage',
  Moderation = 'moderation',
  Page = 'page',
  Rating = 'rating',
  Social = 'social',
}

export type ApplicationController = {
  [key in keyof ApplicationKeys]: RestApplicationPermission;
};

export enum RolePermissionTypes {
  Application = 'application',
  ContentManager = 'content-manager',
  ContentTypeBuilder = 'content-type-builder',
  Documentation = 'documentation',
  Email = 'email',
  Upload = 'upload',
  UsersPermissions = 'users-permissions',
}

export interface RolePermissions {
  [RolePermissionTypes.Application]: RolePermission<ApplicationController>;
  [RolePermissionTypes.ContentManager]: RolePermission<ContentManagerController>;
  [RolePermissionTypes.ContentTypeBuilder]: RolePermission<ContentTypeBuilderController>;
  [RolePermissionTypes.Documentation]: RolePermission<{
    documentation: DocumentationPermission;
  }>;
  [RolePermissionTypes.Email]: RolePermission<{ email: EmailPermission }>;
  [RolePermissionTypes.Upload]: RolePermission<UploadControllerPermission>;
  [RolePermissionTypes.UsersPermissions]: RolePermission<UsersPermission>;
}

export enum RoleType {
  Admin = 'admin',
  Authenticated = 'authenticated',
  Editor = 'editor',
  Public = 'public',
}
export interface Role {
  name: string;
  description: string;
  id: string;
  type: RoleType;
  permissions: RolePermissions;
  users?: User[] | null;
}

export type RoleState = ReactReduxRequestState<
  { role: Role },
  AxiosRequestConfig
>;
export type RolesState = ReactReduxRequestState<
  { roles: Role[] },
  AxiosRequestConfig
>;
