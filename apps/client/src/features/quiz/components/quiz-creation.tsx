import * as z from 'zod';
import { FC, useCallback } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { FieldError } from 'react-hook-form';

import { NoteDropdown } from '@/features/note';
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
        title={'Create a quiz from your notes!'}
        triggerButton={<Button> Create Quiz</Button>}
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
                <NoteDropdown />
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

export default QuizCreationButton;
