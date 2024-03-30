import * as z from 'zod';
import { FC, useCallback } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { FieldError } from 'react-hook-form';

import {
  useCreateNote,
  NotePermissionDropdown,
} from '@nifty/client/features/note';
import { Button } from '@nifty/ui/atoms';
import { FormDrawer, Form, InputField, FieldWrapper } from '@nifty/ui/form';
import { Permission } from '@nifty/api/util/handle-permissions';
import { Authorization } from '@nifty/client/lib/authorization';
import type { CreateNoteRequestBody } from '@nifty/api/domains/note/dto';

const PermissionSchema = z.nativeEnum(Permission);
const schema = z.object({
  title: z.string().min(1).max(50),
  description: z.string().min(0).max(50).optional(),
  publicPermissions: PermissionSchema.optional(),
});

type NoteCreationButtonProps = {
  moduleId: number;
};

export const NoteCreationButton: FC<NoteCreationButtonProps> = ({
  moduleId,
}) => {
  const createNodeMutation = useCreateNote();

  const onSubmit = useCallback(
    async (values: Omit<CreateNoteRequestBody, 'directoryId'>) => {
      const payload: CreateNoteRequestBody = {
        ...values,
        directoryId: moduleId,
      };

      await createNodeMutation.mutateAsync(payload);
    },
    [createNodeMutation]
  );

  return (
    <>
      <FormDrawer
        isDone={createNodeMutation.isSuccess}
        title={'Create a document'}
        triggerButton={
          <div className="flex justify-end py-4">
            <Button> Create Document </Button>
          </div>
        }
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
        <Form<CreateNoteRequestBody, typeof schema>
          schema={schema}
          onSubmit={onSubmit}
          className="w-full flex flex-col align-center justify-center"
        >
          {({ formState, register, setValue, getValues }) => (
            <>
              <div
                className="inline-flex text-left w-full mt-5"
                style={{ marginBottom: -5 }}
              >
                <InputField
                  type="text"
                  label="Document title"
                  error={formState.errors['title'] as FieldError}
                  registration={register('title')}
                />
              </div>
              <div
                className="inline-flex text-left w-full mt-5"
                style={{ marginBottom: -5 }}
              >
                <InputField
                  type="text"
                  label="Description (optional)"
                  error={formState.errors['description'] as FieldError}
                  registration={register('description')}
                />
              </div>

              <div
                className="inline-flex justify-between text-left w-full mt-5"
                style={{ marginBottom: -5 }}
              >
                <Authorization checkPolicy="note:settings:mutate">
                  <FieldWrapper
                    label="Public Permissions"
                    error={formState.errors['publicPermissions'] as FieldError}
                  >
                    <NotePermissionDropdown
                      setPermissions={(value: Permission) =>
                        setValue('publicPermissions', value)
                      }
                    />
                  </FieldWrapper>
                </Authorization>

                <div className="w-full flex justify-end">
                  <Button
                    type="submit"
                    disabled={formState.isSubmitting}
                    loading={formState.isSubmitting}
                  >
                    <FiArrowRight />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Form>
      </FormDrawer>
    </>
  );
};

export default NoteCreationButton;
