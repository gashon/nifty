import * as z from 'zod';
import { useRouter } from 'next/router';
import { useState, useCallback, FC } from 'react';
import { FiArrowRight } from 'react-icons/fi';

import { DirectoryCreateRequest } from '@nifty/api';
import { Button } from '@nifty/ui/atoms';
import { InputField, Form } from '@nifty/ui/form';
import { FieldError } from 'react-hook-form';

const schema = z.object({
  name: z.string().min(1).max(50),
  is_public: z.boolean(),
});

export const ModuleCreationForm: FC<{}> = ({}) => {
  const onSubmit = useCallback(async (values: z.infer<typeof DirectoryCreateRequest>) => {
    // const { status } = await createModule(values);
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
