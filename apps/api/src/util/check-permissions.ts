import { PermissionsType } from "@nifty/server-lib/models/collaborator";

export const checkPermissions = (permissions: PermissionsType[], requiredPermissions: PermissionsType[]) => {
  const hasPermissions = requiredPermissions.every((permission) => permissions.includes(permission));
  return hasPermissions;
}