import * as z from 'zod';
import { useCallback, FC } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { FieldError } from 'react-hook-form';

import { DirectoryCreateRequest } from '@nifty/server-lib/models/directory';
import { createModule } from '@/features/module';

import { Button } from '@nifty/ui/atoms';
import { InputField, Form } from '@nifty/ui/form';

const schema = z.object({
  name: z.string().min(1).max(50),
  is_public: z.boolean(),
});

//z.infer<typeof DirectoryCreateRequest>
export const ModuleCreationForm: FC<{}> = ({}) => {
  const onSubmit = useCallback(async (values: DirectoryCreateRequest) => {
    const payload = { ...values, parent: undefined };
    const response = await createModule(payload);

    const { data: directory } = response.data;
    if (directory) window.location.replace(`/modules/${directory.id}`);
  }, []);

  return (
    <Form<DirectoryCreateRequest, typeof schema>
      schema={schema}
      onSubmit={onSubmit}
      className="w-full flex flex-col align-center justify-center"
    >
      {({ formState, register, getValues }) => (
        <>
          <div className="inline-flex text-left w-full mt-5" style={{ marginBottom: -5 }}>
            <InputField
              type="text"
              label="Name"
              error={formState.errors['name'] as FieldError}
              registration={register('name')}
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
                <p className="text-black">Make module publicly viewable.</p>
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
  );
};
