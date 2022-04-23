import {
  // ApplicationKeys,
  // PrivateRequestKeys,
  // RestMethodKeys,
  // RolePermissionTypes,
  // RoleState,
  User,
} from '@platonist/library';
import React, { FunctionComponent } from 'react';

// import { usePermission, useRoles } from '../../Hooks';

export interface HomepageSettingsProps {
  user: User;
}

export const HomepageSettings: FunctionComponent<HomepageSettingsProps> = ({
  user,
}) => {
  // const role = useRoles(PrivateRequestKeys.Role, user?.role?.id) as RoleState;

  // const [hasPermission] = usePermission({
  //   id: user?.role?.id,
  //   methods: [RestMethodKeys.Update, RestMethodKeys.Create],
  //   permission: RolePermissionTypes.Application,
  //   type: ApplicationKeys.Homepage,
  //   state: role,
  // });

  return <></>;
};

export default HomepageSettings;
