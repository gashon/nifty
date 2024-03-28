type PermissionsType = number;

export enum Permission {
  Read = 1,
  ReadWrite = 3,
  ReadWriteDelete = 7,
  None = 0,
}

export const isPermitted = (
  permissions: PermissionsType,
  requiredPermissions: Permission
): boolean => {
  return (permissions & requiredPermissions) === requiredPermissions;
};

export const setPermissions = (requiredPermissions: Permission): number => {
  return requiredPermissions;
};
