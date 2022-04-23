import React, { FunctionComponent, PropsWithChildren } from 'react';

import {
  ApplicationKeys,
  GlobalState,
  PrivateRequestKeys,
  RestMethodKeys,
  RolePermissionTypes,
  RoleState,
} from '@platonist/library';
import { usePermission } from '../../../Hooks';
import { useRoles } from '../../../Hooks/Requests';
import { useSelector } from 'react-redux';

export interface DebatePermissionProps {
  method?: RestMethodKeys;
}

export const DebatePermission: FunctionComponent<
  PropsWithChildren<DebatePermissionProps>
> = ({ children, method }) => {
  const { result: user } = useSelector<
    GlobalState,
    GlobalState[PrivateRequestKeys.User]
  >((state) => state.user);

  const role = useRoles(PrivateRequestKeys.Role, user?.role?.id) as RoleState;

  const [hasPermission] = usePermission({
    methods: method || [
      RestMethodKeys.Create,
      RestMethodKeys.Update,
      RestMethodKeys.Delete,
    ],
    permission: RolePermissionTypes.Application,
    type: ApplicationKeys.Debate,
    id: user?.role?.id,
    state: role,
  });

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
};
