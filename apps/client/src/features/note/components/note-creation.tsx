import * as z from 'zod';
import { FC, useCallback } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { FiArrowRight } from 'react-icons/fi';
import { FieldError } from 'react-hook-form';

import { useCreateNote } from '@/features/note';

import { Button } from '@nifty/ui/atoms';
import { FormDrawer, Form, InputField } from '@nifty/ui/form';
import { NoteCreateRequest } from '@nifty/server-lib/models/note';

const schema = z.object({
  title: z.string().min(1).max(50),
  description: z.string().min(0).max(50).optional(),
  is_public: z.boolean(),
});

type NoteCreationButtonProps = {
  moduleId: string;
};

export const NoteCreationButton: FC<NoteCreationButtonProps> = ({ moduleId }) => {
  const createNodeMutation = useCreateNote();

  const onSubmit = useCallback(
    async (values: NoteCreateRequest) => {
      const payload = { ...values, directory_id: moduleId };
      await createNodeMutation.mutateAsync(payload);
    },
    [createNodeMutation]
  );

  return (
    <>
      <FormDrawer
        isDone={createNodeMutation.isSuccess}
        title={'Create a document'}
        triggerButton={<Button> Create Document </Button>}
        submitButton={
          <Button
            type="submit"
            disabled={createNodeMutation.isLoading}
            loading={createNodeMutation.isLoading}
          >
            <FiArrowRight />
          </Button>
        }
      >
        <Form<NoteCreateRequest, typeof schema>
          schema={schema}
          onSubmit={onSubmit}
          className="w-full flex flex-col align-center justify-center"
        >
          {({ formState, register }) => (
            <>
              <div className="inline-flex text-left w-full mt-5" style={{ marginBottom: -5 }}>
                <InputField
                  type="text"
                  label="Document title"
                  error={formState.errors['title'] as FieldError}
                  registration={register('title')}
                />
              </div>
              <div className="inline-flex text-left w-full mt-5" style={{ marginBottom: -5 }}>
                <InputField
                  type="text"
                  label="Description (optional)"
                  error={formState.errors['description'] as FieldError}
                  registration={register('description')}
                />
              </div>
              <div
                className="inline-flex float-right text-left w-full mt-5"
                style={{ marginBottom: -5 }}
              >
                <div
                  className="flex items-center justify-between gap-2 inline-flex text-left w-full "
                  style={{ marginBottom: -5 }}
                >
                  <div className="flex flex-row items-center gap-2">
                    <input type="checkbox" {...register('is_public')} />
                    <p className="text-black">Make document publicly viewable.</p>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={formState.isSubmitting}
                  loading={formState.isSubmitting}
                >
                  <FiArrowRight />
                </Button>
              </div>
            </>
          )}
        </Form>
      </FormDrawer>
    </>
  );
};

export default NoteCreationButton;