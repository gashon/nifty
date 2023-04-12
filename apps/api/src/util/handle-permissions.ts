import { PermissionsType } from "@nifty/server-lib/models/collaborator";

export type PermissionStrings = 'r' | 'rw' | 'rwd';

const getPermissionsMap = () => {
  const requiredPermissionMap = {
    r: 1,
    rw: 3,
    rwd: 7,
  };

  return {
    requiredPermissionMap,
  }
}

export const checkPermissions = (permissions: PermissionsType, requiredPermissions: PermissionStrings): boolean => {
  const { requiredPermissionMap } = getPermissionsMap();

  const requiredPermission = requiredPermissionMap[requiredPermissions];
  return (permissions & requiredPermission) === requiredPermission;
}

export const setPermissions = (requiredPermissions: PermissionStrings): number => {
  const { requiredPermissionMap } = getPermissionsMap();

  return requiredPermissionMap[requiredPermissions];
}