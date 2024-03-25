import * as z from 'zod';
import { FC, useCallback } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { FiArrowRight } from 'react-icons/fi';
import { FieldError } from 'react-hook-form';

import { useCreateModule } from '@nifty/client/features/module';

import { Button } from '@nifty/ui/atoms';
import { FormDrawer, Form, InputField } from '@nifty/ui/form';
import { DirectoryCreateRequest } from '@nifty/server-lib/models/directory';

const schema = z.object({
  name: z.string().min(1).max(50),
  alias: z.string().min(0).max(50).optional(),
  credits: z.string().min(0).max(100).optional(),
});

export const ModuleCreationButton: FC = () => {
  const createModuleMutation = useCreateModule();

  const onSubmit = useCallback(
    async (values: DirectoryCreateRequest) => {
      const payload = { ...values, parent: undefined };
      await createModuleMutation.mutateAsync(payload);
    },
    [createModuleMutation]
  );

  return (
    <>
      <FormDrawer
        isDone={createModuleMutation.isSuccess}
        title={'Create a folder'}
        triggerButton={<Button> Create Class</Button>}
        submitButton={
          <Button
            type="submit"
            disabled={createModuleMutation.isLoading}
            loading={createModuleMutation.isLoading}
          >
            <FiArrowRight />
          </Button>
        }
      >
        <Form<DirectoryCreateRequest, typeof schema>
          schema={schema}
          onSubmit={onSubmit}
          className="w-full flex flex-col align-center justify-center"
        >
          {({ formState, register }) => (
            <>
              <div
                className="inline-flex text-left w-full mt-5"
                style={{ marginBottom: -5 }}
              >
                <InputField
                  type="text"
                  label="Class Name"
                  error={formState.errors['name'] as FieldError}
                  registration={register('name')}
                />
              </div>
              <div
                className="inline-flex text-left w-full mt-5"
                style={{ marginBottom: -5 }}
              >
                <InputField
                  type="text"
                  label="Alias (optional): e.g. CS 101"
                  error={formState.errors['alias'] as FieldError}
                  registration={register('alias')}
                />
              </div>
              <div
                className="inline-flex text-left w-full mt-5"
                style={{ marginBottom: -5 }}
              >
                <InputField
                  type="text"
                  label="Number of Credits (optional)"
                  error={formState.errors['credits'] as FieldError}
                  registration={register('credits')}
                />
              </div>
              <div
                className="inline-flex float-right text-left w-full mt-5"
                style={{ marginBottom: -5 }}
              >
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

export default ModuleCreationButton;
