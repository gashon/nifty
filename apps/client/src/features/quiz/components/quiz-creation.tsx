import * as z from 'zod';
import { FC, useCallback } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { FieldError } from 'react-hook-form';

import { NoteDropdown } from '@/features/note';
import { useCreateQuiz } from '@/features/quiz';

import { Button } from '@nifty/ui/atoms';
import { FormDrawer, Form, InputField, FieldWrapper } from '@nifty/ui/form';
import { QuizCreateRequest } from '@nifty/server-lib/models/quiz';

const schema = z.object({
  title: z.string().max(50).optional(),
  note: z.string().min(1).max(100), // note id
  multiple_choice: z.boolean().default(false),
  free_response: z.boolean().default(false),
});

export const QuizCreationButton: FC = () => {
  const createQuizMutation = useCreateQuiz();

  const onSubmit = useCallback(
    async (values: z.infer<typeof schema>) => {
      const payload: QuizCreateRequest = {
        title: values.title,
        note: values.note,
        question_type: {
          multiple_choice: values.multiple_choice,
          free_response: values.free_response,
        },
      };
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
        <Form<z.infer<typeof schema>, typeof schema>
          schema={schema}
          onSubmit={onSubmit}
          className="w-full flex flex-col align-center justify-center"
        >
          {({ formState, setValue, register, getValues, watch }) => {
            const multipleChoice = watch('multiple_choice');
            const freeResponse = watch('free_response');

            return (
              <>
                <div
                  className="inline-flex text-left w-full mt-5"
                  style={{ marginBottom: -5 }}
                >
                  <InputField
                    type="text"
                    label="Quiz title (optional)"
                    error={formState.errors['title'] as FieldError}
                    registration={register('title')}
                  />
                </div>
                <div>
                  {/* Quiz type */}
                  <div className="flex flex-row items-center gap-2">
                    <FieldWrapper
                      label="Quiz type"
                      error={formState.errors['question_type'] as FieldError}
                    >
                      <div className="flex flex-row items-center gap-2">
                        <div
                          className="flex flex-row items-center gap-2 "
                          onClick={(e) => {
                            setValue('multiple_choice', !multipleChoice);
                          }}
                        >
                          <input
                            type="checkbox"
                            name="question_type"
                            className="w-4 h-4"
                            value="multiple_choice"
                            checked={multipleChoice}
                          />
                          <label className="text-black cursor-pointer">
                            Multiple choice
                          </label>
                        </div>

                        <div
                          className="flex flex-row items-center gap-2"
                          onClick={(e) => {
                            setValue('free_response', !freeResponse);
                          }}
                        >
                          <input
                            type="checkbox"
                            name="question_type"
                            className="w-4 h-4"
                            value="free_response"
                            checked={freeResponse}
                          />
                          <label className="text-black cursor-pointer">
                            Free response
                          </label>
                        </div>
                      </div>
                    </FieldWrapper>
                  </div>
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
                      <FieldWrapper
                        label="Note"
                        error={formState.errors['note'] as FieldError}
                      >
                        <NoteDropdown
                          onChange={(noteId) => {
                            setValue('note', noteId);
                          }}
                        />
                      </FieldWrapper>
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
            );
          }}
        </Form>
      </FormDrawer>
    </>
  );
};

export default QuizCreationButton;
