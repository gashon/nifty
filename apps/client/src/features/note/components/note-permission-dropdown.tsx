import { FC, useState } from 'react';
import { DropdownMenu } from '@nifty/ui/atoms';
import { AiOutlinePlus } from 'react-icons/ai';
import { Permission } from '@nifty/api/util/handle-permissions';

export const NotePermissionDropdown: FC<{
  setPermissions: (value: Permission) => void;
}> = ({ setPermissions }) => {
  const [selection, setSelection] =
    useState<'Not Public' | 'Public Read' | 'Public Read-Write'>('Not Public');

  const handleChange = (permission: Permission) => {
    setPermissions(permission);
    switch (permission) {
      case Permission.None:
        setSelection('Not Public');
        break;
      case Permission.Read:
        setSelection('Public Read');
        break;
      case Permission.ReadWrite:
        setSelection('Public Read-Write');
        break;
      default:
        setSelection('Not Public');
        break;
    }
  };

  return (
    <DropdownMenu
      buttonAs="button"
      list={[
        {
          label: 'Not Public',
          icon: <AiOutlinePlus />,
          onClick: () => handleChange(Permission.None),
        },
        {
          label: 'Read',
          icon: <AiOutlinePlus />,
          onClick: () => handleChange(Permission.Read),
        },
        {
          label: 'Read-Write',
          icon: <AiOutlinePlus />,
          onClick: () => handleChange(Permission.ReadWrite),
        },
      ]}
    >
      <div className="flex flex-row items-center gap-2">
        <p className="text-black">{selection}</p>
      </div>
    </DropdownMenu>
  );
};
