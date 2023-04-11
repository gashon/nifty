import status from "http-status";
import openai from "@/lib/openai";
import { createQuizGenerationPrompt } from "@/util"
import { CustomException } from "@/exceptions";

export const generateQuizFromNote = async (noteContent: string) => {
  const prompt = createQuizGenerationPrompt(noteContent);
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
    })

    return response.data.choices[0].text;
  } catch (err) {
    // @ts-ignore
    const message = err.response.data.error.message;
    throw new CustomException(message, status.BAD_REQUEST)
  }
}