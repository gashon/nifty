import { FC, useState } from 'react';
import { DropdownMenu } from '@nifty/ui/atoms';
import { AiOutlineRead, AiOutlineEdit } from 'react-icons/ai';
import { ImCancelCircle } from 'react-icons/im';
import { Permission } from '@nifty/api/util/handle-permissions';

type NotePermissionDropdownProps =
  | {
      setPermissions: (value: Permission) => void;
      onChange?: never;
      initPermissions?: Permission;
    }
  | {
      setPermissions?: never;
      onChange: (value: Permission) => unknown;
      initPermissions?: Permission;
    };

const getPermissionString = (permission: Permission) => {
  switch (permission) {
    case Permission.None:
      return 'Not Public';
    case Permission.Read:
      return 'Public Read';
    case Permission.ReadWrite:
      return 'Public Read-Write';
    default:
      return 'Not Public';
  }
};

export const NotePermissionDropdown: FC<NotePermissionDropdownProps> = ({
  setPermissions,
  onChange,
  initPermissions,
}) => {
  const [selection, setSelection] = useState<
    'Not Public' | 'Public Read' | 'Public Read-Write'
  >(getPermissionString(initPermissions) ?? 'Not Public');

  const handleChange = (permission: Permission) => {
    setSelection(getPermissionString(permission));

    if (typeof onChange === 'function') {
      onChange(permission);
      return;
    }
    setPermissions(permission);
  };

  return (
    <DropdownMenu
      menuClassName="w-max flex flex-col justify-center"
      buttonAs="button"
      list={[
        {
          label: 'Not Public',
          icon: <ImCancelCircle />,
          onClick: () => handleChange(Permission.None),
        },
        {
          label: 'Read',
          icon: <AiOutlineRead />,
          onClick: () => handleChange(Permission.Read),
        },
        {
          label: 'Read-Write',
          icon: <AiOutlineEdit />,
          onClick: () => handleChange(Permission.ReadWrite),
        },
      ]}
    >
      <div className="border border-opacity-4 border-black w-max p-2 flex items-center justify-center rounded">
        <p className="text-black">{selection}</p>
      </div>
    </DropdownMenu>
  );
};
