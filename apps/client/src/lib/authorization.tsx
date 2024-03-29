import { useCallback, ReactNode } from 'react';
import { USER_PERMISSIONS } from '@nifty/common/constants';
import { useAuth } from '@nifty/client/features/auth';

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
  'note:settings:mutate': {
    allowedPermissions: [USER_PERMISSIONS.BETA_TESTER],
  },
};

export const useAuthorization = () => {
  const { user } = useAuth();

  if (user === null)
    return {
      checkAccess: (_: checkAccessArgs) => false,
      permissions: [],
    };

  const checkAccess = useCallback(
    ({ allowedRoles, allowedPermissions }: checkAccessArgs) => {
      // Check if user has any of the allowed roles and permissions
      if (allowedRoles) {
        // todo implement role based access control
        return false;
      }

      if (
        allowedPermissions
        // &&
        // !allowedPermissions.some((permission) =>
        //   (user?.permissions || []).includes(permission)
        // )
      ) {
        return false;
      }

      return true;
    },
    [user]
  );

  return { checkAccess, permissions: user };
};

type AuthorizationProps = {
  forbiddenFallback?: ReactNode;
  children: ReactNode;
} & (
  | (checkAccessArgs & { checkPolicy?: never })
  | {
      checkPolicy: keyof typeof POLICIES;
      allowedRoles?: never;
      allowedPermissions?: never;
    }
);

export const Authorization = ({
  allowedRoles,
  allowedPermissions,
  checkPolicy,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) => {
  const { checkAccess } = useAuthorization();

  const policy = POLICIES[checkPolicy] || {};
  const canAccess = checkAccess({
    allowedRoles,
    allowedPermissions,
    ...policy,
  });

  return <>{canAccess ? children : forbiddenFallback}</>;
};
