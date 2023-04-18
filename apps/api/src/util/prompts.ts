

export const createMultipleChoiceQuizGenerationPrompt = (noteContent: string): string => {
  return `
    Generate a quiz from the following note content. 
    The quiz should have 5-10 questions with 4 possible answers for each.
    There should only be one objectively correct answer. 
    The first answer in the array should be the correct answer. 
    Your incorrect answers should be plausible, but incorrect.
    You may include some True/False questions with 2 possible answers instead of 4.
    Return the quiz as a JSON object in the following format:
    {
      "questions": [
        {
          "question": "Question 1",
          "answers": [
            "Answer 1",
            "Answer 2",
            ...
          ]
        },
        ... 
      ]
    }

    You're output should be stringified JSON - such that it can be parsed into a JavaScript object. Do not include any newline chars (your response should all be on one line).
    Do not include anything else in your response besides the one-line JSON object.
    ---
    ${noteContent}
    ---
  `
}

export const createFreeResponseQuizGenerationPrompt = (noteContent: string): string => {
  return `
    Generate a quiz from the following note content. 
    The quiz should have 4-6 questions. Each question should be a free response question.
    Each question should be able to be answered in 1-2 sentences.
    Return the quiz as a JSON object in the following format:
    {
      "questions": [
        <Question 1>,
        ...
      ]
    }

    You're output should be stringified JSON - such that it can be parsed into a JavaScript object. Do not include any newline chars (your response should all be on one line).
    Do not include anything else in your response besides the one-line JSON object.
    ---
    ${noteContent}
    ---
  `
}

export const createFreeResponseGradingPrompt = (freeResponseQuestionsAndAnswers: string): string => {
  return `
    You are responsible for grading the following free response questions.
    You should provide feedback and identify whether or not the answer is correct.
    Return the grading as a JSON object in the following format:
    {
      "grades": [
       {
        question_id: <question_id>,
        feedback_text: <string>,
        is_correct: <boolean>
       },
        ...
      ]
    }

    You're output should be stringified JSON - such that it can be parsed into a JavaScript object. Do not include any newline chars (your response should all be on one line).
    Do not include anything else in your response besides the one-line JSON object in this exact format.
    JSON.parse(<your_response>) should work without any errors.
    ---
    ${freeResponseQuestionsAndAnswers}
    ---
  `
}