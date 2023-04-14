import { FC, useState } from 'react';
import { DropdownMenu } from '@nifty/ui/atoms';
import { AiOutlinePlus, AiOutlineRead, AiOutlineEdit } from 'react-icons/ai';
import { ImCancelCircle } from 'react-icons/im';
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
