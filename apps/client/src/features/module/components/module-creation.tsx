import * as z from 'zod';
import { FC, useCallback } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { FieldError } from 'react-hook-form';

import { useCreateModule } from '@nifty/client/features/module';

import { Button } from '@nifty/ui/atoms';
import { FormDrawer, Form, InputField } from '@nifty/ui/form';
import type { CreateDirectoryRequestBody } from '@nifty/api/domains/directory/dto';

const schema = z.object({
  name: z.string().min(1).max(50),
  alias: z.string().min(0).max(50).optional().nullable(),
  credits: z.string().optional().nullable(),
});

export const ModuleCreationButton: FC = () => {
  const createModuleMutation = useCreateModule();

  const onSubmit = useCallback(
    async (values: CreateDirectoryRequestBody) => {
      const payload = {
        ...values,
        parentId: undefined,
        credits: values.credits ? Number(values.credits) : null,
      };
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
        <Form<CreateDirectoryRequestBody, typeof schema>
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
                  type="number"
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
