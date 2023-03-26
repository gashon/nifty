import { useCallback, ReactNode } from 'react';
import { USER_PERMISSIONS } from '@nifty/common/constants';
import { useAuth } from '@/features/auth';

export enum ROLES {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

type RoleTypes = keyof typeof ROLES;
type PermissionTypes = keyof typeof USER_PERMISSIONS;
type checkAccessArgs =
  | { allowedRoles?: RoleTypes[]; allowedPermissions: PermissionTypes[] }
  | { allowedRoles: RoleTypes[]; allowedPermissions?: PermissionTypes[] };

export const POLICIES = {
  'theme:mutate': {
    allowedPermissions: [USER_PERMISSIONS.BETA_TESTER],
  },
};

export const useAuthorization = () => {
  const { user } = useAuth();

  if (user === null) {
    throw Error('User does not exist!');
  }

  const checkAccess = useCallback(
    ({ allowedRoles, allowedPermissions }: checkAccessArgs) => {
      // Check if user has any of the allowed roles and permissions
      if (allowedRoles) {
        // todo implement role based access control
        return false;
      }

      if (
        allowedPermissions &&
        !allowedPermissions.some(permission => (user?.permissions || []).includes(permission))
      ) {
        return false;
      }

      return true;
    },
    [user?.permissions]
  );

  return { checkAccess, permissions: user?.permissions };
};

type AuthorizationProps = {
  forbiddenFallback?: ReactNode;
  children: ReactNode;
} & checkAccessArgs;

export const Authorization = ({
  allowedRoles,
  allowedPermissions,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) => {
  const { checkAccess } = useAuthorization();

  const canAccess = checkAccess({ allowedRoles, allowedPermissions });
  return <>{canAccess ? children : forbiddenFallback}</>;
};
