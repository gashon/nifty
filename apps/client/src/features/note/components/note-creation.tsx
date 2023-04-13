import * as z from 'zod';
import { FC, useCallback } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { FieldError } from 'react-hook-form';

import { useCreateNote, NotePermissionDropdown } from '@/features/note';

import { Button } from '@nifty/ui/atoms';
import { FormDrawer, Form, InputField, FieldWrapper } from '@nifty/ui/form';
import { NoteCreateRequest } from '@nifty/server-lib/models/note';
import { Permission } from '@nifty/api/util/handle-permissions';
import { DropdownMenu } from '@nifty/ui/atoms';

const PermissionSchema = z.nativeEnum(Permission);
const schema = z.object({
  title: z.string().min(1).max(50),
  description: z.string().min(0).max(50).optional(),
  is_public: z.boolean(),
  public_permissions: z.array(PermissionSchema).optional(),
});

type NoteCreationButtonProps = {
  moduleId: string;
};

export const NoteCreationButton: FC<NoteCreationButtonProps> = ({
  moduleId,
}) => {
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
        triggerButton={
          <div className="absolute right-0">
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
        <Form<NoteCreateRequest, typeof schema>
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
                className="inline-flex text-left text-black bg-[#d6d6d6] w-min p-2 rounded-lg mt-5"
                style={{ marginBottom: -5 }}
              >
                <FieldWrapper label="Public Permissions">
                  <NotePermissionDropdown
                    setPermissions={(value: Permission) =>
                      setValue('public_permissions', value)
                    }
                  />
                </FieldWrapper>
              </div>
              <div></div>
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
                    <p className="text-black">
                      Allow anyone to edit and view this document. (you can
                      share the link with friends!)
                    </p>
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
