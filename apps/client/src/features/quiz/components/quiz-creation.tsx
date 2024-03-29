import * as z from 'zod';
import { FC, useCallback } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { FieldError } from 'react-hook-form';

import { NoteDropdown } from '@nifty/client/features/note';
import { useCreateQuiz } from '@nifty/client/features/quiz';

import { Button } from '@nifty/ui/atoms';
import { FormDrawer, Form, InputField, FieldWrapper } from '@nifty/ui/form';
import type { CreateQuizRequestBody } from '@nifty/api/domains/quiz/dto';

const schema = z.object({
  title: z.string().max(50).optional(),
  noteId: z.number(),
  multipleChoiceActivated: z.boolean().default(false),
  freeResponseActivated: z.boolean().default(false),
});

export const QuizCreationButton: FC = () => {
  const createQuizMutation = useCreateQuiz();

  const onSubmit = useCallback(
    async (values: z.infer<typeof schema>) => {
      const payload: CreateQuizRequestBody = values;
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
            const multipleChoice = watch('multipleChoiceActivated');
            const freeResponse = watch('freeResponseActivated');

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
                            setValue(
                              'multipleChoiceActivated',
                              !multipleChoice
                            );
                          }}
                        >
                          <input
                            type="checkbox"
                            name="question_type"
                            className="w-4 h-4"
                            value="multipleChoiceActivated"
                            checked={multipleChoice}
                          />
                          <label className="text-black cursor-pointer">
                            Multiple choice
                          </label>
                        </div>

                        <div
                          className="flex flex-row items-center gap-2"
                          onClick={(e) => {
                            setValue('freeResponseActivated', !freeResponse);
                          }}
                        >
                          <input
                            type="checkbox"
                            name="question_type"
                            className="w-4 h-4"
                            value="freeResponseActivated"
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
                        error={formState.errors['noteId'] as FieldError}
                      >
                        <NoteDropdown
                          onChange={(noteId) => {
                            setValue('noteId', noteId);
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
