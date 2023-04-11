

export const createQuizGenerationPrompt = (noteContent: string): string => {
  return `
    Generate a quiz from the following note content. 
    The quiz should have 10-15 questions with 4 possible answers for each.
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

    The response should be stringified JSON.
    Do not include anything else in your response besides the quiz JSON object.
    ---
    ${noteContent}
  `
}