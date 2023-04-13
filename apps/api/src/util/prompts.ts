

export const createQuizGenerationPrompt = (noteContent: string): string => {
  return `
    Generate a quiz from the following note content. 
    The quiz should have 5-10 questions with 4 possible answers for each.
    The first answer should be the correct answer.
    Return the quiz as a JSON object in the following format:
    {
      "questions": [
        {
          "question": "Question 1",
          "answers": [
            "Answer 1",
            ...
          ]
        },
        ... 
      ]
    }

    You're output should be stringified JSON - such that it can be parsed into a JavaScript object. Do not include any newline chars.
    Do not include anything else in your response besides the quiz JSON object.
    ---
    ${noteContent}
    ---
  `
}