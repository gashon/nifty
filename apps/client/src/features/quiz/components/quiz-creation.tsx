import * as z from 'zod';
import { FC, useCallback } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { FiArrowRight } from 'react-icons/fi';
import { FieldError } from 'react-hook-form';

import { useCreateQuiz } from '@/features/quiz';

import { Button } from '@nifty/ui/atoms';
import { FormDrawer, Form, InputField } from '@nifty/ui/form';
import { QuizCreateRequest } from '@nifty/server-lib/models/quiz';

const schema = z.object({
  name: z.string().min(1).max(50),
  alias: z.string().min(0).max(50).optional(),
  credits: z.string().min(0).max(100).optional(),
  is_public: z.boolean(),
});

export const QuizCreationButton: FC = () => {
  const createQuizMutation = useCreateQuiz();

  const onSubmit = useCallback(
    async (values: QuizCreateRequest) => {
      const payload = { ...values, parent: undefined };
      await createQuizMutation.mutateAsync(payload);
    },
    [createQuizMutation]
  );

  return (
    <>
      <FormDrawer
        isDone={createQuizMutation.isSuccess}
        title={'Create a quiz'}
        triggerButton={<Button> Create Module</Button>}
        submitButton={
          <Button
            type="submit"
            disabled={createQuizMutation.isLoading}
            loading={createQuizMutation.isLoading}
          >
            <FiArrowRight />
          </Button>
        }
      >
        <Form<QuizCreateRequest, typeof schema>
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
      </FormDrawer>
    </>
  );
};

export default QuizCreationButton;
