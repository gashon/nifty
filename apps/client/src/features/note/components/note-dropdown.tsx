import { FC, useState } from 'react';
import { DropdownMenu } from '@nifty/ui/atoms';
import { useInfiniteNotes } from '@nifty/client/features/note';

export const NoteDropdown: FC<{
  onChange: (value: string | undefined) => void;
}> = ({ onChange }) => {
  const [selection, setSelection] = useState<undefined | string>(undefined);
  const { data } = useInfiniteNotes({
    limit: 100,
  });

  const notes = (data?.pages || [])
    // @ts-ignore
    .flatMap(({ data }) => data || [])
    .map((note) => ({
      label: note.title,
      icon: (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#2DD4BF"
            d="M40.8,-75.8C50.1,-65.3,53,-48.8,61.7,-35.2C70.4,-21.5,85,-10.8,87.3,1.3C89.6,13.4,79.7,26.9,69.9,38.6C60.1,50.3,50.3,60.3,38.7,69.1C27.1,78,13.5,85.6,0.5,84.8C-12.6,84,-25.2,74.8,-35.5,65.2C-45.8,55.6,-53.8,45.6,-59.2,34.7C-64.6,23.8,-67.4,11.9,-68.6,-0.7C-69.8,-13.2,-69.3,-26.5,-64.3,-38.1C-59.3,-49.8,-49.8,-59.8,-38.4,-69.1C-26.9,-78.3,-13.4,-86.7,1.2,-88.7C15.8,-90.7,31.5,-86.3,40.8,-75.8Z"
            transform="translate(100 100)"
          />
        </svg>
      ),
      onClick: () => {
        setSelection(note.title);
        onChange(note.id);
      },
    }));

  return (
    <div className="text-black bg-transparent z-20 w-full">
      <DropdownMenu
        menuClassName="w-max flex flex-col justify-center"
        buttonAs="button"
        list={notes}
      >
        <p className="underline w-full">{selection || 'Select Note'}</p>
      </DropdownMenu>
    </div>
  );
};
