import { FC, useState, useContext } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { ModuleCreationForm } from '@/features/module';

import ModuleCard from '@nifty/ui/molecules/module-card';
import { ParentModal } from '@nifty/ui/molecules';

export const ModuleCreationButton: FC<{}> = ({}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <ModuleCard
        icon={<AiOutlinePlus size={55} />}
        variant={'button'}
        onClick={() => setOpen(true)}
      />
      <ParentModal open={open} title={'Create a module'} onClose={() => setOpen(false)}>
        <ModuleCreationForm />
      </ParentModal>
    </>
  );
};

export default ModuleCreationButton;
