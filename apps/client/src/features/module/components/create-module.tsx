import { FC, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { ModuleCreationForm } from '@/features/module';

import ModuleCard from '@nifty/ui/molecules/module-card';
import { ParentModal } from '@nifty/ui/molecules';

export const CreateModule: FC<{}> = ({}) => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <>
      <ModuleCard
        icon={<AiOutlinePlus size={55} />}
        variant={'button'}
        onClick={() => console.log('Create')}
      />
      <ParentModal open={open} title={'Create a module'} onClose={() => setOpen(false)}>
        <ModuleCreationForm />
      </ParentModal>
    </>
  );
};

export default CreateModule;
